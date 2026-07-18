const { mysqlPool } = require('../config/db');

// --- Departments ---
exports.getDepartments = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM departments');
    res.json({ success: true, departments: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createDepartment = async (req, res) => {
  const { name, code, description } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO departments (name, code, description) VALUES (?, ?, ?)',
      [name, code, description]
    );
    res.status(201).json({ success: true, departmentId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Courses ---
exports.getCourses = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query(`
      SELECT c.*, d.name as department_name 
      FROM courses c 
      JOIN departments d ON c.department_id = d.id
    `);
    res.json({ success: true, courses: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCourse = async (req, res) => {
  const { department_id, name, duration_years, semester_count } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO courses (department_id, name, duration_years, semester_count) VALUES (?, ?, ?, ?)',
      [department_id, name, duration_years, semester_count]
    );
    res.status(201).json({ success: true, courseId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Subjects ---
exports.getSubjects = async (req, res) => {
  try {
    const { courseId, semester } = req.query;
    let query = 'SELECT s.*, c.name as course_name FROM subjects s JOIN courses c ON s.course_id = c.id WHERE 1=1';
    const params = [];
    if (courseId) {
      query += ' AND s.course_id = ?';
      params.push(courseId);
    }
    if (semester) {
      query += ' AND s.semester = ?';
      params.push(semester);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, subjects: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createSubject = async (req, res) => {
  const { course_id, semester, name, code, credit_hours } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO subjects (course_id, semester, name, code, credit_hours) VALUES (?, ?, ?, ?, ?)',
      [course_id, semester, name, code, credit_hours]
    );
    res.status(201).json({ success: true, subjectId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- Timetable ---
exports.getTimetable = async (req, res) => {
  const { courseId, semester, teacherId } = req.query;
  try {
    let query = `
      SELECT t.*, c.name as course_name, sub.name as subject_name, sub.code as subject_code,
             concat(teach.first_name, ' ', teach.last_name) as teacher_name 
      FROM timetable t
      JOIN courses c ON t.course_id = c.id
      JOIN subjects sub ON t.subject_id = sub.id
      JOIN teachers teach ON t.teacher_id = teach.id
      WHERE 1=1
    `;
    const params = [];

    if (courseId) {
      query += ' AND t.course_id = ?';
      params.push(courseId);
    }
    if (semester) {
      query += ' AND t.semester = ?';
      params.push(semester);
    }
    if (teacherId) {
      query += ' AND t.teacher_id = ?';
      params.push(teacherId);
    }

    // Sort by day of week and start time
    query += " ORDER BY FIELD(t.day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'), t.start_time";

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, timetable: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTimetableEntry = async (req, res) => {
  const { course_id, semester, subject_id, teacher_id, day_of_week, start_time, end_time, classroom } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO timetable (course_id, semester, subject_id, teacher_id, day_of_week, start_time, end_time, classroom) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [course_id, semester, subject_id, teacher_id, day_of_week, start_time, end_time, classroom]
    );
    res.status(201).json({ success: true, timetableId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTimetableEntry = async (req, res) => {
  const entryId = req.params.id;
  try {
    await mysqlPool.query('DELETE FROM timetable WHERE id = ?', [entryId]);
    res.json({ success: true, message: 'Timetable entry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
