const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/admin', verifyToken, authorize('admin'), dashboardController.getAdminStats);
router.get('/teacher', verifyToken, authorize('teacher'), dashboardController.getTeacherDashboard);
router.get('/student', verifyToken, authorize('student'), dashboardController.getStudentDashboard);

module.exports = router;
