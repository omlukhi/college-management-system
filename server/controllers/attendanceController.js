const { AttendanceLog } = require('../models/mongodbModels');
const { mysqlPool } = require('../config/db');

// Mark Daily Attendance (Saves log in MongoDB, updates statistics summary in MySQL)
exports.markAttendance = async (req, res) => {
  const { date, subjectId, courseId, semester, records } = req.body;
  const teacherId = req.user.id; // teacher logged in (or details)

  if (!date || !subjectId || !courseId || !semester || !records || !records.length) {
    return res.status(400).json({ success: false, message: 'Invalid payload.' });
  }

  const connection = await mysqlPool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Fetch teacher record matching user ID to get teachers.id
    const [teachers] = await connection.query('SELECT id FROM teachers WHERE user_id = ?', [teacherId]);
    const actualTeacherId = teachers.length > 0 ? teachers[0].id : 1;

    // 2. Save detailed log in MongoDB
    const log = await AttendanceLog.create({
      date,
      subjectId: parseInt(subjectId),
      courseId: parseInt(courseId),
      semester: parseInt(semester),
      teacherId: actualTeacherId,
      records: records.map(r => ({
        studentId: parseInt(r.studentId),
        status: r.status // 'Present' or 'Absent'
      }))
    });

    // 3. Update summary counts in MySQL
    for (const record of records) {
      const studentId = parseInt(record.studentId);
      const isPresent = record.status === 'Present' ? 1 : 0;

      await connection.query(
        `INSERT INTO attendance (student_id, subject_id, total_classes, attended_classes) 
         VALUES (?, ?, 1, ?) 
         ON DUPLICATE KEY UPDATE 
         total_classes = total_classes + 1, 
         attended_classes = attended_classes + ?`,
        [studentId, parseInt(subjectId), isPresent, isPresent]
      );
    }

    await connection.commit();
    res.status(201).json({ success: true, message: 'Attendance recorded successfully.', logId: log._id });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

// Get monthly attendance reports or logs
exports.getAttendanceLogs = async (req, res) => {
  const { courseId, semester, subjectId, date } = req.query;
  try {
    const filter = {};
    if (courseId) filter.courseId = parseInt(courseId);
    if (semester) filter.semester = parseInt(semester);
    if (subjectId) filter.subjectId = parseInt(subjectId);
    if (date) filter.date = date;

    const logs = await AttendanceLog.find(filter).sort({ date: -1 });
    res.json({ success: true, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get attendance percentage for student
exports.getStudentAttendance = async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const [rows] = await mysqlPool.query(
      `SELECT a.*, s.name as subject_name, s.code as subject_code 
       FROM attendance a
       JOIN subjects s ON a.subject_id = s.id
       WHERE a.student_id = ?`,
      [studentId]
    );

    res.json({ success: true, attendance: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
