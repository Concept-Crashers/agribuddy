const mongoose = require('mongoose');

const subscriptionLogSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true,
    },
    focus: {
        type: String,
        required: true,
    },
    messageSent: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('SubscriptionLog', subscriptionLogSchema);
