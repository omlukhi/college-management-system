const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', verifyToken, authorize(['admin', 'teacher']), attendanceController.markAttendance);
router.get('/logs', verifyToken, attendanceController.getAttendanceLogs);
router.get('/student/:studentId', verifyToken, attendanceController.getStudentAttendance);

module.exports = router;
