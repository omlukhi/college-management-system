const { mysqlPool } = require('../config/db');
const { AttendanceLog, Notification, Assignment } = require('../models/mongodbModels');

exports.getAdminStats = async (req, res) => {
  try {
    // 1. Total counts from MySQL
    const [[{ total_students }]] = await mysqlPool.query('SELECT count(*) as total_students FROM students');
    const [[{ total_teachers }]] = await mysqlPool.query('SELECT count(*) as total_teachers FROM teachers');
    const [[{ total_depts }]] = await mysqlPool.query('SELECT count(*) as total_depts FROM departments');
    const [[{ total_courses }]] = await mysqlPool.query('SELECT count(*) as total_courses FROM courses');
    
    // 2. Fees collection summary
    const [[feesSummary]] = await mysqlPool.query(`
      SELECT 
        SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END) as collected,
        SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END) as pending
      FROM fees
    `);

    // 3. Library inventory
    const [[{ total_books, issued_books }]] = await mysqlPool.query(`
      SELECT SUM(quantity) as total_books, SUM(quantity - available_quantity) as issued_books FROM library_books
    `);

    // 4. Placements count
    const [[{ placed_students }]] = await mysqlPool.query(`
      SELECT count(*) as placed_students FROM placements WHERE status = 'Placed'
    `);

    // 5. Recent Activity Logs (Get count from MongoDB)
    const totalAssignments = await Assignment.countDocuments();
    const totalAlerts = await Notification.countDocuments();
    const totalAttendanceDays = await AttendanceLog.countDocuments();

    // 6. Graphs Data - Fees Collection over time
    const [feesChart] = await mysqlPool.query(`
      SELECT DATE_FORMAT(paid_date, '%b %Y') as month, SUM(amount) as total 
      FROM fees 
      WHERE status = 'Paid' AND paid_date IS NOT NULL
      GROUP BY month 
      ORDER BY paid_date LIMIT 6
    `);

    // 7. Graphs Data - Student Performance Distribution (Result Averages)
    const [performanceChart] = await mysqlPool.query(`
      SELECT grade, count(*) as count 
      FROM results 
      GROUP BY grade
    `);

    // 8. Recent actions log (Mock activity log based on notices/events/contacts)
    const [recentNotices] = await mysqlPool.query('SELECT title, posted_by, created_at FROM notices ORDER BY created_at DESC LIMIT 5');

    res.json({
      success: true,
      stats: {
        students: total_students,
        teachers: total_teachers,
        departments: total_depts,
        courses: total_courses,
        revenue: feesSummary.collected || 0,
        pendingFees: feesSummary.pending || 0,
        books: total_books || 0,
        issuedBooks: issued_books || 0,
        placedStudents: placed_students,
        assignments: totalAssignments,
        alerts: totalAlerts,
        attendanceDays: totalAttendanceDays
      },
      charts: {
        feesCollection: feesChart,
        grades: performanceChart
      },
      recentActivity: recentNotices
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeacherDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    // Get teacher ID
    const [teachers] = await mysqlPool.query('SELECT id, department_id FROM teachers WHERE user_id = ?', [userId]);
    if (teachers.length === 0) {
      return res.status(404).json({ success: false, message: 'Teacher profile not found.' });
    }
    const teacherId = teachers[0].id;

    // Get assigned subjects
    const [subjects] = await mysqlPool.query(`
      SELECT s.*, c.name as course_name 
      FROM timetable t
      JOIN subjects s ON t.subject_id = s.id
      JOIN courses c ON t.course_id = c.id
      WHERE t.teacher_id = ?
      GROUP BY s.id
    `, [teacherId]);

    // Count assignments uploaded by this teacher
    const assignmentCount = await Assignment.countDocuments({ teacherId });
    const studyMaterialsCount = await StudyMaterial.countDocuments({ teacherId });

    res.json({
      success: true,
      teacherId,
      assignedSubjectsCount: subjects.length,
      uploadedAssignments: assignmentCount,
      uploadedMaterials: studyMaterialsCount,
      subjects
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStudentDashboard = async (req, res) => {
  const userId = req.user.id;
  try {
    const [students] = await mysqlPool.query(`
      SELECT s.*, c.name as course_name, d.name as dept_name 
      FROM students s
      JOIN courses c ON s.course_id = c.id
      JOIN departments d ON s.department_id = d.id
      WHERE s.user_id = ?
    `, [userId]);

    if (students.length === 0) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const student = students[0];

    // Fetch student specific counts
    // Attendance Avg
    const [[attendanceAvg]] = await mysqlPool.query(
      'SELECT AVG(percentage) as avg_percent FROM attendance WHERE student_id = ?',
      [student.id]
    );

    // Pending Fees
    const [[pendingFees]] = await mysqlPool.query(
      'SELECT SUM(amount) as pending FROM fees WHERE student_id = ? AND status = "Pending"',
      [student.id]
    );

    // Book loans active
    const [[activeLoans]] = await mysqlPool.query(
      'SELECT count(*) as count FROM book_loans WHERE student_id = ? AND status = "Issued"',
      [student.id]
    );

    res.json({
      success: true,
      student,
      stats: {
        attendancePercentage: parseFloat(attendanceAvg.avg_percent || 0).toFixed(2),
        pendingFees: pendingFees.pending || 0,
        activeBooksCount: activeLoans.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
