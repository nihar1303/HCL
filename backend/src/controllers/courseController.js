const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a course
// @route   POST /api/courses
// @access  Private (Admin)
const addCourse = async (req, res) => {
    try {
        const { courseId, name, credits, seats } = req.body;

        const courseExists = await Course.findOne({ courseId });
        if (courseExists) {
            return res.status(400).json({ message: 'Course ID already exists' });
        }

        const course = await Course.create({
            courseId,
            name,
            credits,
            seats,
            availableSeats: seats
        });

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
const updateCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.courseId = req.body.courseId || course.courseId;
        course.name = req.body.name || course.name;
        course.credits = req.body.credits || course.credits;

        // Handle seat changes carefully to avoid messing up available seats logic badly, 
        // a simple approach for mock is just to adjust it blindly or reset it.
        if (req.body.seats) {
            const diff = req.body.seats - course.seats;
            course.seats = req.body.seats;
            course.availableSeats += diff;
        }

        const updatedCourse = await course.save();
        res.status(200).json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        await course.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private (Student)
const enrollCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.availableSeats <= 0) {
            return res.status(400).json({ message: 'Course is full' });
        }

        if (course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already enrolled in this course' });
        }

        course.enrolledStudents.push(req.user._id);
        course.availableSeats -= 1;
        await course.save();

        res.status(200).json({ message: `Successfully enrolled in ${course.name}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Drop a course
// @route   POST /api/courses/:id/drop
// @access  Private (Student)
const dropCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (!course.enrolledStudents.includes(req.user._id)) {
            return res.status(400).json({ message: 'Not enrolled in this course' });
        }

        course.enrolledStudents = course.enrolledStudents.filter(
            studentId => studentId.toString() !== req.user._id.toString()
        );
        course.availableSeats += 1;
        await course.save();

        res.status(200).json({ message: `Successfully dropped ${course.name}` });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const seedCourses = async (req, res) => {
    try {
        const mockCourses = [
            { courseId: 'CS101', name: 'Introduction to Computer Science', credits: 4, seats: 30, availableSeats: 5 },
            { courseId: 'CS201', name: 'Data Structures and Algorithms', credits: 4, seats: 40, availableSeats: 12 },
            { courseId: 'ENG105', name: 'Professional English', credits: 3, seats: 60, availableSeats: 0 },
            { courseId: 'MAT201', name: 'Linear Algebra', credits: 3, seats: 50, availableSeats: 20 },
        ];

        await Course.deleteMany();
        const createdCourses = await Course.insertMany(mockCourses);
        res.status(201).json(createdCourses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    dropCourse,
    seedCourses
};
