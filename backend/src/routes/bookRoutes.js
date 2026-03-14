const express = require('express');
const router = express.Router();
const {
    getBooks,
    createBook,
    updateBook,
    deleteBook
} = require('../controllers/bookController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getBooks)
    .post(protect, adminOnly, createBook);

router.route('/:id')
    .put(protect, adminOnly, updateBook)
    .delete(protect, adminOnly, deleteBook);

module.exports = router;
