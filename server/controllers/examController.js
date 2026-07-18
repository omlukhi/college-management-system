const { mysqlPool } = require('../config/db');

// List Exams
exports.getExams = async (req, res) => {
  const { courseId, semester } = req.query;
  try {
    let query = `
      SELECT e.*, c.name as course_name, s.name as subject_name, s.code as subject_code 
      FROM exams e
      JOIN courses c ON e.course_id = c.id
      JOIN subjects s ON e.subject_id = s.id
      WHERE 1=1
    `;
    const params = [];
    if (courseId) {
      query += ' AND e.course_id = ?';
      params.push(courseId);
    }
    if (semester) {
      query += ' AND e.semester = ?';
      params.push(semester);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, exams: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create / Schedule Exam
exports.createExam = async (req, res) => {
  const { name, course_id, semester, subject_id, exam_date, max_marks } = req.body;
  try {
    const [result] = await mysqlPool.query(
      'INSERT INTO exams (name, course_id, semester, subject_id, exam_date, max_marks) VALUES (?, ?, ?, ?, ?, ?)',
      [name, course_id, semester, subject_id, exam_date, max_marks || 100]
    );
    res.status(201).json({ success: true, examId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
