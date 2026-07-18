const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, feeController.getFees);
router.post('/collect/:id', verifyToken, authorize(['admin']), feeController.collectFee);
router.post('/schedule', verifyToken, authorize('admin'), feeController.createFeeSchedule);

module.exports = router;
