const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('express-async-handler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Send an announcement to all users
// @route   POST /api/admin/announcements
// @access  Private (Admin)
exports.sendAnnouncement = asyncHandler(async (req, res, next) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    // In a real app, this should be a background job for large user bases
    const users = await User.find({ role: { $ne: 'Admin' } });
    const notifications = users.map(user => ({
        user: user._id,
        type: 'announcement',
        message: message,
    }));

    await Notification.insertMany(notifications);

    // Here you could also trigger a push notification via Socket.io or another service.

    res.status(200).json({ success: true, message: 'Announcement sent to all users.' });
});
