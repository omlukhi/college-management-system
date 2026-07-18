const { mysqlPool } = require('../config/db');

// Calculate Grade and Status
const computeGradeAndStatus = (internal, external) => {
  const total = parseInt(internal || 0) + parseInt(external || 0);
  let grade = 'F';
  let status = 'Fail';

  if (total >= 90) grade = 'O';
  else if (total >= 80) grade = 'A';
  else if (total >= 70) grade = 'B';
  else if (total >= 60) grade = 'C';
  else if (total >= 50) grade = 'D';
  else if (total >= 40) grade = 'E';

  if (total >= 40) {
    status = 'Pass';
  }

  return { total, grade, status };
};

// Enter Marks
exports.enterMarks = async (req, res) => {
  const { student_id, exam_id, subject_id, internal_marks, external_marks } = req.body;
  if (!student_id || !exam_id || !subject_id) {
    return res.status(400).json({ success: false, message: 'Missing required parameters.' });
  }

  try {
    const { grade, status } = computeGradeAndStatus(internal_marks, external_marks);

    const [result] = await mysqlPool.query(
      `INSERT INTO results (student_id, exam_id, subject_id, internal_marks, external_marks, grade, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       internal_marks = ?, external_marks = ?, grade = ?, status = ?`,
      [student_id, exam_id, subject_id, internal_marks, external_marks, grade, status, internal_marks, external_marks, grade, status]
    );

    res.json({ success: true, message: 'Marks entered successfully.', resultId: result.insertId || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Results
exports.getResults = async (req, res) => {
  const { studentId, examId, subjectId, courseId, semester } = req.query;
  try {
    let query = `
      SELECT r.*, e.name as exam_name, s.name as subject_name, s.code as subject_code,
             concat(stu.first_name, ' ', stu.last_name) as student_name, stu.enrollment_no, c.name as course_name 
      FROM results r
      JOIN exams e ON r.exam_id = e.id
      JOIN subjects s ON r.subject_id = s.id
      JOIN students stu ON r.student_id = stu.id
      JOIN courses c ON stu.course_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (studentId) {
      query += ' AND r.student_id = ?';
      params.push(studentId);
    }
    if (examId) {
      query += ' AND r.exam_id = ?';
      params.push(examId);
    }
    if (subjectId) {
      query += ' AND r.subject_id = ?';
      params.push(subjectId);
    }
    if (courseId) {
      query += ' AND stu.course_id = ?';
      params.push(courseId);
    }
    if (semester) {
      query += ' AND stu.semester = ?';
      params.push(semester);
    }

    const [rows] = await mysqlPool.query(query, params);
    res.json({ success: true, results: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
