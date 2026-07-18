const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { verifyToken, authorize } = require('../middleware/auth');

// Departments
router.get('/departments', verifyToken, courseController.getDepartments);
router.post('/departments', verifyToken, authorize('admin'), courseController.createDepartment);

// Courses
router.get('/courses', verifyToken, courseController.getCourses);
router.post('/courses', verifyToken, authorize('admin'), courseController.createCourse);

// Subjects
router.get('/subjects', verifyToken, courseController.getSubjects);
router.post('/subjects', verifyToken, authorize('admin'), courseController.createSubject);

// Timetable
router.get('/timetable', verifyToken, courseController.getTimetable);
router.post('/timetable', verifyToken, authorize('admin'), courseController.createTimetableEntry);
router.delete('/timetable/:id', verifyToken, authorize('admin'), courseController.deleteTimetableEntry);

module.exports = router;
