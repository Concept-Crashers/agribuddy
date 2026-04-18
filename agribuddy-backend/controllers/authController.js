const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendSMS } = require('../services/smsService');

// Helper to Create and send token
const sendTokenResponse = (user, statusCode, res) => {
    const token = jwt.sign(
        { id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(statusCode).json({
        success: true,
        token,
        user: {
            id: user._id,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            district: user.district,
            role: user.role
        }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { fullName, phoneNumber, district, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ phoneNumber });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'Phone number already registered' });
        }

        // Create user
        const user = await User.create({
            fullName,
            phoneNumber,
            district,
            password,
            role
        });

        sendTokenResponse(user, 201, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { phoneNumber, password } = req.body;

        // Validate phone number & password
        if (!phoneNumber || !password) {
            return res.status(400).json({ success: false, error: 'Please provide a phone number and password' });
        }

        // Check for user (include password)
        const user = await User.findOne({ phoneNumber }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ phoneNumber: req.body.phoneNumber });

        if (!user) {
            return res.status(404).json({ success: false, error: 'There is no user with that phone number' });
        }

        // Get reset token and OTP
        const { resetToken, resetOtp } = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create SMS message
        const message = `Your AgriBuddy password reset code is: ${resetOtp}. This code is valid for 10 minutes.`;

        try {
            await sendSMS(user.phoneNumber, message);

            res.status(200).json({
                success: true,
                message: 'SMS sent successfully',
                data: 'Reset code sent to phone via SMS'
            });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            user.resetPasswordOtp = undefined;
            user.resetPasswordOtpExpire = undefined;

            await user.save({ validateBeforeSave: false });

            return res.status(500).json({ success: false, error: 'SMS could not be sent' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Reset Password via OTP
// @route   PUT /api/auth/resetpassword
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        // Get hashed OTP
        const resetPasswordOtp = crypto
            .createHash('sha256')
            .update(req.body.otp)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordOtp,
            resetPasswordOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired reset code' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
