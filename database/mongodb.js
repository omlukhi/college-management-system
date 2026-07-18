// MongoDB Collections Schema Reference Documentation
// Used for unstructured and dynamic content in the College Management System

const mongoose = require('mongoose');

// 1. StudentDocuments Collection
const StudentDocumentsSchema = new mongoose.Schema({
  studentId: { type: Number, required: true }, // References MySQL students.id
  documentType: { type: String, required: true }, // e.g., '10th Marksheet', 'Income Certificate'
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Path to local storage or cloud
  uploadedAt: { type: Date, default: Date.now }
});

// 2. Assignments Collection
const AssignmentsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subjectCode: { type: String, required: true }, // References MySQL subjects.code
  courseId: { type: Number, required: true }, // References MySQL courses.id
  semester: { type: Number, required: true },
  filePath: { type: String }, // Path to attachment file
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  teacherId: { type: Number, required: true } // References MySQL teachers.id
});

// 3. StudyMaterials Collection
const StudyMaterialsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  subjectCode: { type: String, required: true }, // References MySQL subjects.code
  courseId: { type: Number, required: true }, // References MySQL courses.id
  semester: { type: Number, required: true },
  filePath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  teacherId: { type: Number, required: true } // References MySQL teachers.id
});

// 4. ActivityLogs Collection
const ActivityLogsSchema = new mongoose.Schema({
  userId: { type: Number, required: true }, // References MySQL users.id
  action: { type: String, required: true }, // e.g., 'Login', 'Marked Attendance', 'Updated Salary'
  ipAddress: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

// 5. Notifications Collection
const NotificationsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  senderRole: { type: String, required: true }, // 'admin' or 'teacher'
  targetRole: { type: String, required: true }, // 'all', 'teacher', 'student'
  isReadBy: [{ type: Number }], // Array of MySQL user_ids who have read it
  createdAt: { type: Date, default: Date.now }
});

// 6. Gallery Collection
const GallerySchema = new mongoose.Schema({
  albumName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  description: { type: String },
  uploadDate: { type: Date, default: Date.now }
});

// 7. AttendanceLogs Collection (Daily records of students attendance)
const AttendanceLogsSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  subjectId: { type: Number, required: true }, // References MySQL subjects.id
  courseId: { type: Number, required: true }, // References MySQL courses.id
  semester: { type: Number, required: true },
  teacherId: { type: Number, required: true }, // References MySQL teachers.id
  records: [{
    studentId: { type: Number, required: true }, // References MySQL students.id
    status: { type: String, enum: ['Present', 'Absent'], required: true }
  }],
  createdAt: { type: Date, default: Date.now }
});

// 8. UploadedFiles Collection
const UploadedFilesSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, required: true },
  size: { type: Number, required: true },
  url: { type: String, required: true },
  uploadedBy: { type: Number, required: true }, // References MySQL users.id
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = {
  StudentDocuments: mongoose.model('StudentDocuments', StudentDocumentsSchema),
  Assignments: mongoose.model('Assignments', AssignmentsSchema),
  StudyMaterials: mongoose.model('StudyMaterials', StudyMaterialsSchema),
  ActivityLogs: mongoose.model('ActivityLogs', ActivityLogsSchema),
  Notifications: mongoose.model('Notifications', NotificationsSchema),
  Gallery: mongoose.model('Gallery', GallerySchema),
  AttendanceLogs: mongoose.model('AttendanceLogs', AttendanceLogsSchema),
  UploadedFiles: mongoose.model('UploadedFiles', UploadedFilesSchema)
};
