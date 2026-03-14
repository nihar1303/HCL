const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a book title']
    },
    author: {
        type: String,
        required: [true, 'Please add an author']
    },
    category: {
        type: String,
        required: [true, 'Please add a category']
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock amount'],
        default: 0
    }
}, {
    timestamps: true
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
