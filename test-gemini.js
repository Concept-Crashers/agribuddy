import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY;

async function testDirectRestApi() {
    console.log('Testing direct REST API call...');
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
        const response = await axios.get(url);

        console.log('SUCCESS! API Key is working.');
        console.log(`Found ${response.data.models.length} models.`);
        console.log('Available models:');
        response.data.models.forEach(m => {
            if (m.name.includes('gemini')) {
                console.log(`- ${m.name}`);
            }
        });
    } catch (error) {
        console.log('REST API FAILED');
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log('Error Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.log('Error:', error.message);
        }
    }
}

testDirectRestApi();
