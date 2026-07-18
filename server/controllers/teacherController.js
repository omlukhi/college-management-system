const { mysqlPool } = require('../config/db');
const bcrypt = require('bcryptjs');

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const { departmentId } = req.query;
    let query = `
      SELECT t.*, d.name as department_name, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (departmentId) {
      query += ' AND t.department_id = ?';
      params.push(departmentId);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, teachers: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single teacher details
exports.getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const query = `
      SELECT t.*, d.name as department_name, u.email 
      FROM teachers t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN departments d ON t.department_id = d.id
      WHERE t.id = ?
    `;
    const [rows] = await mysqlPool.query(query, [teacherId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    res.json({ success: true, teacher: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Teacher Profile
exports.createTeacher = async (req, res) => {
  const { employee_id, first_name, last_name, email, phone, address, department_id, qualification, salary } = req.body;

  if (!email || !employee_id || !first_name || !last_name || !department_id || !qualification || !salary) {
    return res.status(400).json({ success: false, message: 'Required details are missing.' });
  }

  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if teacher user already exists
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create user login account
    const teacherHash = await bcrypt.hash('teacher123', 10);
    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, teacherHash, 'teacher']
    );
    const userId = userResult.insertId;

    // Insert teacher
    const [teacherResult] = await connection.query(
      `INSERT INTO teachers (user_id, employee_id, first_name, last_name, phone, address, department_id, qualification, salary, joining_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())`,
      [userId, employee_id, first_name, last_name, phone, address, department_id, qualification, salary]
    );

    await connection.commit();
    res.status(201).json({ success: true, message: 'Teacher created successfully.', teacherId: teacherResult.insertId });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Update Teacher Profile
exports.updateTeacher = async (req, res) => {
  const teacherId = req.params.id;
  const { first_name, last_name, phone, address, department_id, qualification, salary } = req.body;

  try {
    const query = `
      UPDATE teachers 
      SET first_name = ?, last_name = ?, phone = ?, address = ?, department_id = ?, qualification = ?, salary = ?
      WHERE id = ?
    `;
    await mysqlPool.query(query, [first_name, last_name, phone, address, department_id, qualification, salary, teacherId]);
    res.json({ success: true, message: 'Teacher profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Teacher
exports.deleteTeacher = async (req, res) => {
  const teacherId = req.params.id;
  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    const [rows] = await connection.query('SELECT user_id FROM teachers WHERE id = ?', [teacherId]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ success: false, message: 'Teacher not found.' });
    }

    const userId = rows[0].user_id;

    // Delete user account (which cascades and deletes the teacher record)
    await connection.query('DELETE FROM users WHERE id = ?', [userId]);

    await connection.commit();
    res.json({ success: true, message: 'Teacher deleted successfully.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};
