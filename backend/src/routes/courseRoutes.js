const express = require('express');
const router = express.Router();
const {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    enrollCourse,
    dropCourse,
    seedCourses
} = require('../controllers/courseController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCourses)
    .post(protect, adminOnly, addCourse);

router.route('/:id')
    .put(protect, adminOnly, updateCourse)
    .delete(protect, adminOnly, deleteCourse);

router.post('/:id/enroll', protect, enrollCourse);
router.post('/:id/drop', protect, dropCourse);

router.post('/seed', protect, adminOnly, seedCourses);

module.exports = router;
