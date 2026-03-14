const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    courseId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;
