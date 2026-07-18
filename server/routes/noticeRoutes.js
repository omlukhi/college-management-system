const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', noticeController.getNotices);
router.post('/', verifyToken, authorize(['admin', 'teacher']), noticeController.createNotice);
router.delete('/:id', verifyToken, authorize(['admin']), noticeController.deleteNotice);

// User notifications
router.get('/notifications', verifyToken, noticeController.getNotifications);

module.exports = router;
