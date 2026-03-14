const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Private (Student/Admin)
const getBooks = async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = async (req, res) => {
    try {
        const { title, author, category, stock } = req.body;

        const book = await Book.create({
            title,
            author,
            category,
            stock
        });

        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getBooks,
    createBook,
    updateBook,
    deleteBook
};
