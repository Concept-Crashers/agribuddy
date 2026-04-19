const cron = require('node-cron');
const Farmer = require('../models/Farmer');
const SubscriptionLog = require('../models/SubscriptionLog');
const geminiService = require('./geminiService');
const smsService = require('./smsService');
const marketPriceService = require('./marketPriceService');

/**
 * Start the automated delivery service for subscribed farmers.
 * The cron expression "0 8 * * 1,3,5,6" means:
 * Run at 08:00 AM on Monday, Wednesday, Friday, Saturday.
 */
function startCronJobs() {
    console.log('Initializing scheduled agricultural tips cron job...');

    cron.schedule('0 8 * * 1,3,5,6', async () => {
        console.log('Running scheduled Agricultural Tips Broadcast...');
        try {
            const now = new Date();
            // Find farmers who have an active subscription that hasn't expired
            const subscribedFarmers = await Farmer.find({
                'subscriptions.isActive': true,
                'subscriptions.expiresAt': { $gt: now }
            });

            console.log(`Found ${subscribedFarmers.length} active subscriptions.`);

            for (const farmer of subscribedFarmers) {
                try {
                    const focus = farmer.subscriptions.focus || 'general agriculture';
                    
                    // Construct a prompt asking for a unique tip
                    const prompt = `Write a short, engaging, 140 character SMS farming tip about "${focus}" for farmers in Uganda. Provide a completely new and unique tip that offers actionable advice or modern practices.`;
                    
                    const advice = await geminiService.getAgriculturalAdvice(prompt, "System prompt for unique broadcast tips.");
                    const msg = `AgriBuddy Tip (${focus}): ${advice.answer}`;
                    
                    await smsService.sendSMS(farmer.phoneNumber, msg);

                    // Log the tip so we have a record
                    await SubscriptionLog.create({
                        phoneNumber: farmer.phoneNumber,
                        focus: focus,
                        messageSent: msg
                    });

                } catch (err) {
                    console.error(`Failed to send automated tip to ${farmer.phoneNumber}:`, err);
                }
            }

            // Also nicely clean up subscriptions that have expired
            await Farmer.updateMany(
                { 'subscriptions.isActive': true, 'subscriptions.expiresAt': { $lte: now } },
                { $set: { 'subscriptions.isActive': false } }
            );

        } catch (error) {
            console.error('Error during agricultural tips cron job execution:', error);
        }
    });

    // Sync Market Prices every 12 hours (00:00 and 12:00)
    cron.schedule('0 0,12 * * *', async () => {
        console.log('Running scheduled Market Price Synchronization...');
        try {
            await marketPriceService.syncAllPrices();
        } catch (error) {
            console.error('Error during market price sync cron job execution:', error);
        }
    });
}

module.exports = { startCronJobs };
