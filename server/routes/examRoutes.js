const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, examController.getExams);
router.post('/', verifyToken, authorize(['admin', 'teacher']), examController.createExam);

module.exports = router;
