const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('../config/db');

// Register User
exports.register = async (req, res) => {
  const { email, password, role, details } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Missing required parameters.' });
  }

  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // Check if user already exists
    const [existing] = await connection.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [userResult] = await connection.query(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    const userId = userResult.insertId;

    // Based on role, create student or teacher profile details
    if (role === 'student') {
      const { enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id } = details;
      await connection.query(
        'INSERT INTO students (user_id, enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id, admission_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())',
        [userId, enrollment_no, first_name, last_name, dob, gender, phone, address, department_id, course_id]
      );
    } else if (role === 'teacher') {
      const { employee_id, first_name, last_name, phone, address, department_id, qualification, salary } = details;
      await connection.query(
        'INSERT INTO teachers (user_id, employee_id, first_name, last_name, phone, address, department_id, qualification, salary, joining_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE())',
        [userId, employee_id, first_name, last_name, phone, address, department_id, qualification, salary]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'User registered successfully.' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Login User
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [users] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = users[0];
    if (user.status !== 'active') {
      return res.status(403).json({ success: false, message: 'Your account is deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'supersecretkeyforcollegeprojectbcamca',
      { expiresIn: '24h' }
    );

    // Fetch role-specific details
    let profile = { id: user.id, email: user.email, role: user.role };
    if (user.role === 'student') {
      const [students] = await mysqlPool.query('SELECT * FROM students WHERE user_id = ?', [user.id]);
      if (students.length > 0) profile = { ...profile, ...students[0] };
    } else if (user.role === 'teacher') {
      const [teachers] = await mysqlPool.query('SELECT * FROM teachers WHERE user_id = ?', [user.id]);
      if (teachers.length > 0) profile = { ...profile, ...teachers[0] };
    }

    res.json({ success: true, token, user: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = 'SELECT id, email, role, status, created_at FROM users WHERE id = ?';
    if (role === 'student') {
      query = `
        SELECT u.id as user_id, u.email, u.role, s.*, d.name as department_name, c.name as course_name 
        FROM users u 
        LEFT JOIN students s ON u.id = s.user_id 
        LEFT JOIN departments d ON s.department_id = d.id
        LEFT JOIN courses c ON s.course_id = c.id
        WHERE u.id = ?`;
    } else if (role === 'teacher') {
      query = `
        SELECT u.id as user_id, u.email, u.role, t.*, d.name as department_name 
        FROM users u 
        LEFT JOIN teachers t ON u.id = t.user_id 
        LEFT JOIN departments d ON t.department_id = d.id
        WHERE u.id = ?`;
    }

    const [profiles] = await mysqlPool.query(query, [userId]);
    if (profiles.length === 0) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    res.json({ success: true, profile: profiles[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
