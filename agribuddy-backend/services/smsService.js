const axios = require('axios');

const AT_USERNAME = process.env.AT_USERNAME || 'sandbox';
const AT_API_KEY = process.env.AT_API_KEY;

/**
 * Send an SMS via Africa's Talking messaging API.
 * @param {string|string[]} to - The recipient's phone number or an array of numbers.
 * @param {string} message - The message constraint to send.
 * @returns {Promise<any>} Response from the Africa's Talking API
 */
const sendSMS = async (to, message) => {
    try {
        if (!AT_API_KEY) {
            console.warn(`[SMS Mock] SMS would be sent:`);
            console.warn(`To: ${Array.isArray(to) ? to.join(',') : to}`);
            console.warn(`Message: "${message}"`);
            console.warn(`Please set AT_USERNAME and AT_API_KEY in your .env file to enable real SMS delivery.`);
            return { status: 'mock_success' };
        }

        const isSandbox = AT_USERNAME === 'sandbox';
        const url = isSandbox 
            ? 'https://api.sandbox.africastalking.com/version1/messaging' 
            : 'https://api.africastalking.com/version1/messaging';

        const data = new URLSearchParams();
        data.append('username', AT_USERNAME);
        data.append('to', Array.isArray(to) ? to.join(',') : to);
        data.append('message', message);

        const response = await axios.post(url, data.toString(), {
            headers: {
                'apiKey': AT_API_KEY,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
        
        console.log('SMS sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error sending SMS:', error.response?.data || error.message);
        // Throwing error up may crash async detached promises, returning is safer
        return { error: error.message };
    }
};

module.exports = {
    sendSMS
};
