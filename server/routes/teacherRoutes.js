const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/', verifyToken, teacherController.getAllTeachers);
router.get('/:id', verifyToken, teacherController.getTeacherById);
router.post('/', verifyToken, authorize('admin'), teacherController.createTeacher);
router.put('/:id', verifyToken, authorize(['admin', 'teacher']), teacherController.updateTeacher);
router.delete('/:id', verifyToken, authorize('admin'), teacherController.deleteTeacher);

module.exports = router;
