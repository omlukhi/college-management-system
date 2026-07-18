const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');
const { verifyToken, authorize } = require('../middleware/auth');

router.get('/books', verifyToken, libraryController.getBooks);
router.post('/books', verifyToken, authorize('admin'), libraryController.addBook);
router.get('/loans', verifyToken, libraryController.getLoans);
router.post('/issue', verifyToken, authorize('admin'), libraryController.issueBook);
router.post('/return/:id', verifyToken, authorize('admin'), libraryController.returnBook);

module.exports = router;
