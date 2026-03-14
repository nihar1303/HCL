const mongoose = require('mongoose');

const borrowRecordSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Book'
    },
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Returned', 'Overdue'],
        default: 'Active'
    }
}, {
    timestamps: true
});

const BorrowRecord = mongoose.model('BorrowRecord', borrowRecordSchema);
module.exports = BorrowRecord;
