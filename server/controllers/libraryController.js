const { mysqlPool } = require('../config/db');

// List Library Books
exports.getBooks = async (req, res) => {
  const { search } = req.query;
  try {
    let query = 'SELECT * FROM library_books WHERE 1=1';
    const params = [];
    if (search) {
      query += ' AND (title LIKE ? OR author LIKE ? OR isbn LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, books: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add Library Book
exports.addBook = async (req, res) => {
  const { title, author, isbn, quantity, rack_no } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO library_books (title, author, isbn, quantity, available_quantity, rack_no) VALUES (?, ?, ?, ?, ?, ?)',
      [title, author, isbn, quantity, quantity, rack_no]
    );
    res.status(201).json({ success: true, bookId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Issued Loans
exports.getLoans = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT bl.*, b.title as book_title, b.isbn, concat(s.first_name, ' ', s.last_name) as student_name, s.enrollment_no 
      FROM book_loans bl
      JOIN library_books b ON bl.book_id = b.id
      JOIN students s ON bl.student_id = s.id
    `);
    res.json({ success: true, loans: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Issue Book
exports.issueBook = async (req, res) => {
  const { book_id, student_id, due_date } = req.body;
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // Check availability
    const [books] = await connection.query('SELECT available_quantity FROM library_books WHERE id = ?', [book_id]);
    if (books.length === 0 || books[0].available_quantity <= 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Book is currently unavailable.' });
    }

    // Insert loan
    await connection.query(
      'INSERT INTO book_loans (book_id, student_id, issue_date, due_date, status) VALUES (?, ?, CURDATE(), ?, "Issued")',
      [book_id, student_id, due_date]
    );

    // Decrement availability
    await connection.query(
      'UPDATE library_books SET available_quantity = available_quantity - 1 WHERE id = ?',
      [book_id]
    );

    await connection.commit();
    res.json({ success: true, message: 'Book issued successfully.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Return Book
exports.returnBook = async (req, res) => {
  const loanId = req.params.id;
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // Get Loan Info
    const [loans] = await connection.query('SELECT * FROM book_loans WHERE id = ?', [loanId]);
    if (loans.length === 0 || loans[0].status === 'Returned') {
      connection.release();
      return res.status(404).json({ success: false, message: 'Active loan record not found.' });
    }

    const loan = loans[0];
    const dueDate = new Date(loan.due_date);
    const returnDate = new Date();
    
    // Calculate Fine: 5 rupees per day late
    let fine = 0.00;
    if (returnDate > dueDate) {
      const diffTime = Math.abs(returnDate - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 5.00;
    }

    // Update loan record
    await connection.query(
      'UPDATE book_loans SET return_date = CURDATE(), fine_amount = ?, status = "Returned" WHERE id = ?',
      [fine, loanId]
    );

    // Increment availability
    await connection.query(
      'UPDATE library_books SET available_quantity = available_quantity + 1 WHERE id = ?',
      [loan.book_id]
    );

    await connection.commit();
    res.json({ success: true, message: 'Book returned successfully.', fine_amount: fine });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
