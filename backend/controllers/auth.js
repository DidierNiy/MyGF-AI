const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

// @desc    Register a new user (and start verification)
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user but don't verify yet
    user = new User({ name, email, password, phone });

    const verificationToken = user.getVerificationToken();

    await user.save();

    // In a real application, you would send the `verificationToken` via email or SMS.
    // For this simulation, we log it to the console.
    console.log(`--- ACCOUNT VERIFICATION ---`);
    console.log(`User: ${email}`);
    console.log(`OTP: ${verificationToken}`);
    console.log(`--------------------------`);

    res.status(201).json({ success: true, message: 'Registration successful. Please check your email/SMS for a verification code.' });
});

// @desc    Verify user account
// @route   POST /api/auth/verify
// @access  Public
exports.verifyAccount = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    // Hash the incoming OTP to compare with the one in the DB
    const hashedToken = crypto
        .createHash('sha256')
        .update(otp)
        .digest('hex');

    const user = await User.findOne({
        email,
        verificationToken: hashedToken,
        verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ success: false, message: 'Invalid or expired verification code.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
});


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
        return res.status(401).json({ success: false, message: 'Account not verified. Please check your email.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
});

// @desc    Complete user setup (role & plan)
// @route   PUT /api/auth/setup
// @access  Private
exports.setupAccount = asyncHandler(async (req, res, next) => {
    const { role, plan } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    user.subscription.plan = plan;
    // In a real app, payment status would be pending until webhook confirmation
    user.subscription.status = 'active';
    user.subscription.expiresAt = new Date(new Date().setMonth(new Date().getMonth() + 1));

    await user.save();

    res.status(200).json({ success: true, data: user });
});


// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
});


// Helper to get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};