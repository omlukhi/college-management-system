const { mysqlPool } = require('../config/db');

// List Fees
exports.getFees = async (req, res) => {
  const { studentId, status } = req.query;
  try {
    let query = `
      SELECT f.*, concat(s.first_name, ' ', s.last_name) as student_name, s.enrollment_no, c.name as course_name 
      FROM fees f
      JOIN students s ON f.student_id = s.id
      JOIN courses c ON s.course_id = c.id
      WHERE 1=1
    `;
    const params = [];
    if (studentId) {
      query += ' AND f.student_id = ?';
      params.push(studentId);
    }
    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, fees: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Record/Collect Fee Payment
exports.collectFee = async (req, res) => {
  const feeId = req.params.id;
  const { payment_method } = req.body;
  try {
    const receiptNo = `REC-${Date.now().toString().slice(-8)}`;
    await mysqlPool.query(
      'UPDATE fees SET status = "Paid", paid_date = CURDATE(), payment_method = ?, receipt_no = ? WHERE id = ?',
      [payment_method || 'Cash', receiptNo, feeId]
    );

    res.json({ success: true, message: 'Payment recorded successfully.', receipt_no: receiptNo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Generate fee invoice for all students in a course + semester
exports.createFeeSchedule = async (req, res) => {
  const { course_id, semester, amount, due_date } = req.body;
  if (!course_id || !semester || !amount || !due_date) {
    return res.status(400).json({ success: false, message: 'All parameters are required.' });
  }

  try {
    // Get all students in this course + semester
    const [students] = await mysqlPool.query(
      'SELECT id FROM students WHERE course_id = ? AND semester = ?',
      [course_id, semester]
    );

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'No students found in this course/semester.' });
    }

    for (const student of students) {
      await mysqlPool.query(
        'INSERT INTO fees (student_id, semester, amount, due_date, status) VALUES (?, ?, ?, ?, "Pending")',
        [student.id, semester, amount, due_date]
      );
    }

    res.status(201).json({ success: true, message: `Fee schedule generated for ${students.length} students.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
