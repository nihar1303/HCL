const express = require('express');
const router = express.Router();
const {
    getBorrows,
    getMyBorrows,
    borrowBook,
    returnBook,
    simulateOverdue
} = require('../controllers/borrowController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, adminOnly, getBorrows)
    .post(protect, borrowBook);

router.get('/my', protect, getMyBorrows);

router.put('/:id/return', protect, adminOnly, returnBook);
router.put('/:id/simulate-overdue', protect, adminOnly, simulateOverdue);

module.exports = router;
