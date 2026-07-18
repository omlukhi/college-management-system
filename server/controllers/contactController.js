const { mysqlPool } = require('../config/db');

// Submit an inquiry (Guest)
exports.submitInquiry = async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  try {
    await mysqlPool.query(
      'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
      [name, email, subject, message]
    );
    res.status(201).json({ success: true, message: 'Your message has been submitted. We will get back to you shortly!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all messages (Admin)
exports.getMessages = async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json({ success: true, messages: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reply to message (Admin)
exports.replyMessage = async (req, res) => {
  const msgId = req.params.id;
  const { replied_message } = req.body;
  if (!replied_message) {
    return res.status(400).json({ success: false, message: 'Reply content cannot be empty.' });
  }

  try {
    await mysqlPool.query(
      'UPDATE contacts SET replied_message = ?, status = "replied" WHERE id = ?',
      [replied_message, msgId]
    );
    res.json({ success: true, message: 'Reply saved successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  const msgId = req.params.id;
  try {
    await mysqlPool.query('DELETE FROM contacts WHERE id = ?', [msgId]);
    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
