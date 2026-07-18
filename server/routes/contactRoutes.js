const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken, authorize } = require('../middleware/auth');

router.post('/', contactController.submitInquiry);
router.get('/', verifyToken, authorize('admin'), contactController.getMessages);
router.put('/reply/:id', verifyToken, authorize('admin'), contactController.replyMessage);
router.delete('/:id', verifyToken, authorize('admin'), contactController.deleteMessage);

module.exports = router;
