const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Please provide a phone number'],
        unique: true,
        trim: true
    },
    email: {
        type: String, // Optional now
        sparse: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    district: {
        type: String,
        required: [true, 'Please provide a district for weather updates'],
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
        select: false // Don't return password by default
    },
    role: {
        type: String,
        enum: ['farmer', 'administrator'],
        default: 'farmer'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    resetPasswordOtp: String,
    resetPasswordOtpExpire: Date
});

// Method to generate and hash password reset token/OTP
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const crypto = require('crypto');
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Generate 6-digit OTP for SMS
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash token and set to resetPasswordToken field
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordOtp = crypto
        .createHash('sha256')
        .update(resetOtp)
        .digest('hex');

    // Set expire (10 minutes)
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    this.resetPasswordOtpExpire = Date.now() + 10 * 60 * 1000;

    return { resetToken, resetOtp };
};

// Hash password before saving
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
