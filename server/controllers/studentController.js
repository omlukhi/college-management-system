const { mysqlPool } = require('../config/db');
const { StudentDocument } = require('../models/mongodbModels');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Ensure directory exists utility
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create QR Code for Student
const generateStudentQR = async (enrollmentNo, name, course) => {
  const qrDir = path.join(__dirname, '..', 'uploads', 'qrcodes');
  ensureDir(qrDir);
  const filePath = path.join(qrDir, `${enrollmentNo}.png`);
  const relativePath = `/uploads/qrcodes/${enrollmentNo}.png`;

  const data = JSON.stringify({
    enrollment: enrollmentNo,
    name: name,
    course: course,
    timestamp: new Date().toISOString()
  });

  await QRCode.toFile(filePath, data, {
    color: {
      dark: '#1e3a8a', // Dark Blue Theme
      light: '#ffffff'
    }
  });

  return relativePath;
};

// Get all students (Search & Filters)
exports.getAllStudents = async (req, res) => {
  try {
    const { search, courseId, semester } = req.query;
    let query = `
      SELECT s.*, d.name as department_name, c.name as course_name, u.email 
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ' AND (s.first_name LIKE ? OR s.last_name LIKE ? OR s.enrollment_no LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (courseId) {
      query += ' AND s.course_id = ?';
      params.push(courseId);
    }
    if (semester) {
      query += ' AND s.semester = ?';
      params.push(semester);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, students: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single student details
exports.getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    const query = `
      SELECT s.*, d.name as department_name, c.name as course_name, u.email 
      FROM students s
      JOIN users u ON s.user_id = u.id
      LEFT JOIN departments d ON s.department_id = d.id
      LEFT JOIN courses c ON s.course_id = c.id
      WHERE s.id = ?
    `;
    const [rows] = await mysqlPool.query(query, [studentId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Fetch documents from MongoDB
    const docs = await StudentDocument.find({ studentId: studentId });

    res.json({ success: true, student: rows[0], documents: docs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Student Profile
exports.createStudent = async (req, res) => {
  const { first_name, last_name, email, enrollment_no, dob, gender, phone, address, department_id, course_id, semester } = req.body;
  
  if (!email || !enrollment_no || !first_name || !last_name || !department_id || !course_id) {
    return res.status(400).json({ success: false, message: 'Required details are missing.' });
  }

  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // Create user login account first
    const defaultPasswordHash = await QRCode.toDataURL(enrollment_no); // temporary
    const studentHash = await require('bcryptjs').hash('student123', 10);
    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, studentHash, 'student']
    );
    const userId = userResult.insertId;

    // Generate QR Code
    const qrPath = await generateStudentQR(enrollment_no, `${first_name} ${last_name}`, course_id);

    // Insert student
    const [studentResult] = await connection.query(
      `INSERT INTO students (user_id, enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id, semester, admission_date, qr_code_path) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?)`,
      [userId, enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id, semester || 1, qrPath]
    );

    await connection.commit();
    res.status(201).json({ success: true, message: 'Student created successfully.', studentId: studentResult.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Update Student Profile
exports.updateStudent = async (req, res) => {
  const studentId = req.params.id;
  const { first_name, last_name, dob, gender, phone, address, department_id, course_id, semester } = req.body;

  try {
    // Check if photo is uploaded
    let photoPath = null;
    if (req.file) {
      photoPath = `/uploads/photos/${req.file.filename}`;
    }

    let query = `
      UPDATE students 
      SET first_name = ?, last_name = ?, dob = ?, gender = ?, phone = ?, address = ?, department_id = ?, course_id = ?, semester = ?
    `;
    const params = [first_name, last_name, dob, gender, phone, address, department_id, course_id, semester];

    if (photoPath) {
      query += ', photo_path = ?';
      params.push(photoPath);
    }
    
    query += ' WHERE id = ?';
    params.push(studentId);

    await mysqlPool.query(query, params);
    res.json({ success: true, message: 'Student profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Student
exports.deleteStudent = async (req, res) => {
  const studentId = req.params.id;
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT user_id FROM students WHERE id = ?', [studentId]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const userId = rows[0].user_id;

    // Delete student record (which cascades user due to foreign key constraints)
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);

    // Clean up student documents in MongoDB
    await StudentDocument.deleteMany({ studentId: studentId });

    await connection.commit();
    res.json({ success: true, message: 'Student deleted successfully.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Upload Student Document (stored in MongoDB)
exports.uploadDocument = async (req, res) => {
  const studentId = req.params.id;
  const { documentType } = req.body;

  if (!req.file || !documentType) {
    return res.status(400).json({ success: false, message: 'File and Document Type are required.' });
  }

  try {
    const docPath = `/uploads/documents/${req.file.filename}`;
    const newDoc = await StudentDocument.create({
      studentId: parseInt(studentId),
      documentType,
      fileName: req.file.originalname,
      fileUrl: docPath
    });

    res.status(201).json({ success: true, message: 'Document uploaded successfully.', document: newDoc });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
