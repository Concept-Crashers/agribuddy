require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const ussdRoutes = require('./routes/ussd');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001; // Using 3001 as React is usually on 3000

// Africa's Talking sends USSD data as form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use('/ussd', ussdRoutes);

app.get('/', (req, res) => {
    res.send('AgriBuddy backend is running. USSD endpoint is at /ussd');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
