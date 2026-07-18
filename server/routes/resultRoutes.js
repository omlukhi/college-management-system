const express = require('express');
const router = express.Router();
const resultController = require('../controllers/resultController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, resultController.getResults);
router.post('/enter', verifyToken, authorize(['admin', 'teacher']), resultController.enterMarks);

module.exports = router;
