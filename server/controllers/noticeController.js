const { mysqlPool } = require('../config/db');
const { Notification } = require('../models/mongodbModels');

// Get all notices
exports.getNotices = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM notices ORDER BY created_at DESC');
    res.json({ success: true, notices: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Notice
exports.createNotice = async (req, res) => {
  const { title, content, posted_by, target_role } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  try {
    // 1. Insert into MySQL Notices (for general board)
    await mysqlPool.query(
      'INSERT INTO notices (title, content, posted_by, target_role) VALUES (?, ?, ?, ?)',
      [title, content, posted_by || 'Admin Office', target_role || 'all']
    );

    // 2. Insert into MongoDB Notifications (to trigger user alerts)
    await Notification.create({
      title,
      message: content,
      senderRole: 'admin',
      targetRole: target_role || 'all'
    });

    res.status(201).json({ success: true, message: 'Notice created and broadcasted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Notice
exports.deleteNotice = async (req, res) => {
  const noticeId = req.params.id;
  try {
    await mysqlPool.query('DELETE FROM notices WHERE id = ?', [noticeId]);
    res.json({ success: true, message: 'Notice deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get User Alerts (Notifications from MongoDB)
exports.getNotifications = async (req, res) => {
  const role = req.user.role;
  try {
    // Return notifications targetted at 'all' or specific user role
    const notifications = await Notification.find({
      targetRole: { $in: ['all', role] }
    }).sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
