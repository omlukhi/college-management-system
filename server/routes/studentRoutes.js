const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dest = path.join(__dirname, '..', 'uploads');
    if (file.fieldname === 'photo') {
      dest = path.join(dest, 'photos');
    } else if (file.fieldname === 'document') {
      dest = path.join(dest, 'documents');
    }
    
    // Create dir if doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Routes
router.get('/', verifyToken, studentController.getAllStudents);
router.get('/:id', verifyToken, studentController.getStudentById);

// Admin-only creation
router.post('/', verifyToken, authorize('admin'), studentController.createStudent);

// Admin or Self updating
router.put('/:id', verifyToken, upload.single('photo'), studentController.updateStudent);

// Admin only deleting
router.delete('/:id', verifyToken, authorize('admin'), studentController.deleteStudent);

// Document upload
router.post('/:id/documents', verifyToken, upload.single('document'), studentController.uploadDocument);

module.exports = router;
