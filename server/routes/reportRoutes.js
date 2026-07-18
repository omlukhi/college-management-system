const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/attendance', verifyToken, reportController.getAttendanceAnalysis);
router.get('/results', verifyToken, reportController.getResultAnalysis);
router.get('/export', verifyToken, authorize('admin'), reportController.exportCSV);
router.get('/pdf', verifyToken, reportController.generatePDF);

module.exports = router;
