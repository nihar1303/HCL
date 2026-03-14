const User = require('../models/User');
const { sendStatusEmail } = require('../utils/mailer');

// @desc    Get all users (students)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'student' }).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create user (student or admin) manually
// @route   POST /api/users
// @access  Private/Admin
const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student',
            status: status || 'Active' // Admins creating users bypass the 'Pending' default
        });

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a user's status or details
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Build the fields to update (only what was sent)
        const updateFields = {};
        if (req.body.name !== undefined)   updateFields.name = req.body.name;
        if (req.body.email !== undefined)  updateFields.email = req.body.email;
        if (req.body.role !== undefined)   updateFields.role = req.body.role;
        if (req.body.status !== undefined) updateFields.status = req.body.status;

        // Handle password change separately so we can hash it
        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            updateFields.password = await bcrypt.hash(req.body.password, salt);
        }

        // Use findByIdAndUpdate to bypass the pre-save hook (avoids re-hashing)
        const prevStatus = user.status;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true, runValidators: false }
        ).select('-password');

        // Send status-change email to the student (non-blocking)
        if (updateFields.status && updateFields.status !== prevStatus) {
            let action = updateFields.status; // 'Active' or 'Suspended'
            // If going from Suspended -> Active, it's a reactivation
            if (updateFields.status === 'Active' && prevStatus === 'Suspended') {
                action = 'Reactivated';
            }
            sendStatusEmail({ name: updatedUser.name, email: updatedUser.email }, action);
        }

        res.status(200).json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send deletion email before removing (non-blocking)
        sendStatusEmail({ name: user.name, email: user.email }, 'Deleted');

        await user.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};
