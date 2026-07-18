const mongoose = require('mongoose');

// Student Documents Mongoose Schema
const StudentDocumentSchema = new mongoose.Schema({
  studentId: { type: Number, required: true },
  documentType: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// Assignments Mongoose Schema
const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subjectCode: { type: String, required: true },
  courseId: { type: Number, required: true },
  semester: { type: Number, required: true },
  filePath: { type: String },
  dueDate: { type: Date, required: true },
  teacherId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Study Material Mongoose Schema
const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subjectCode: { type: String, required: true },
  courseId: { type: Number, required: true },
  semester: { type: Number, required: true },
  filePath: { type: String, required: true },
  teacherId: { type: Number, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

// System Activity Logs
const ActivityLogSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  action: { type: String, required: true },
  ipAddress: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// Notifications Model (Notice board updates & alerts)
const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  senderRole: { type: String, required: true },
  targetRole: { type: String, required: true, default: 'all' }, // 'all', 'teacher', 'student'
  isReadBy: [{ type: Number }], // Array of MySQL user_ids
  createdAt: { type: Date, default: Date.now }
});

// Gallery Album Photos/Videos
const GallerySchema = new mongoose.Schema({
  albumName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

// Detailed Attendance Logs per Day
const AttendanceLogSchema = new mongoose.Schema({
  date: { type: String, required: true }, // YYYY-MM-DD
  subjectId: { type: Number, required: true },
  courseId: { type: Number, required: true },
  semester: { type: Number, required: true },
  teacherId: { type: Number, required: true },
  records: [{
    studentId: { type: Number, required: true },
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = {
  StudentDocument: mongoose.model('StudentDocument', StudentDocumentSchema),
  Assignment: mongoose.model('Assignment', AssignmentSchema),
  StudyMaterial: mongoose.model('StudyMaterial', StudyMaterialSchema),
  ActivityLog: mongoose.model('ActivityLog', ActivityLogSchema),
  Notification: mongoose.model('Notification', NotificationSchema),
  Gallery: mongoose.model('Gallery', GallerySchema),
  AttendanceLog: mongoose.model('AttendanceLog', AttendanceLogSchema)
};
