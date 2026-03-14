const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');

// @desc    Get all borrow records
// @route   GET /api/borrows
// @access  Private/Admin
const getBorrows = async (req, res) => {
    try {
        const borrows = await BorrowRecord.find({}).populate('student', 'name email').populate('book', 'title author');
        res.status(200).json(borrows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in student borrow records
// @route   GET /api/borrows/my
// @access  Private/Student
const getMyBorrows = async (req, res) => {
    try {
        const borrows = await BorrowRecord.find({ student: req.user._id }).populate('book', 'title author');
        res.status(200).json(borrows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Borrow a book
// @route   POST /api/borrows
// @access  Private/Student
const borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.stock <= 0) {
            return res.status(400).json({ message: 'Book is out of stock' });
        }

        // Check if user already borrowed this book and hasn't returned it
        const existingBorrow = await BorrowRecord.findOne({
            student: req.user._id,
            book: bookId,
            status: { $in: ['Active', 'Overdue'] }
        });

        if (existingBorrow) {
            return res.status(400).json({ message: 'You have already borrowed this book' });
        }

        // Set due date to 14 days from now
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const borrow = await BorrowRecord.create({
            student: req.user._id,
            book: bookId,
            dueDate
        });

        // Decrease stock
        book.stock -= 1;
        await book.save();

        res.status(201).json(borrow);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Return a borrowed book
// @route   PUT /api/borrows/:id/return
// @access  Private/Admin (Admin processes returns)
const returnBook = async (req, res) => {
    try {
        const borrow = await BorrowRecord.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        if (borrow.status === 'Returned') {
            return res.status(400).json({ message: 'Book is already returned' });
        }

        borrow.status = 'Returned';
        await borrow.save();

        // Increase book stock
        const book = await Book.findById(borrow.book);
        if (book) {
            book.stock += 1;
            await book.save();
        }

        res.status(200).json({ message: 'Book returned successfully', borrow });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Simulate an overdue borrow for testing
// @route   PUT /api/borrows/:id/simulate-overdue
// @access  Private/Admin
const simulateOverdue = async (req, res) => {
    try {
        const borrow = await BorrowRecord.findById(req.params.id);

        if (!borrow) {
            return res.status(404).json({ message: 'Borrow record not found' });
        }

        if (borrow.status === 'Returned') {
            return res.status(400).json({ message: 'Cannot mark a returned book as overdue' });
        }

        // Set due date to 5 days ago
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 5);

        borrow.dueDate = pastDate;
        borrow.status = 'Overdue'; // Optional based on schema, but ensures it's flagged
        await borrow.save();

        res.status(200).json({ message: 'Book simulated as overdue', borrow });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getBorrows,
    getMyBorrows,
    borrowBook,
    returnBook,
    simulateOverdue
};
