require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const ussdRoutes = require('./routes/ussd');
const diagnosisRoutes = require('./routes/diagnosis');
const cropsRoutes = require('./routes/crops');
const marketplaceRoutes = require('./routes/marketplace');
const communityRoutes = require('./routes/community');
const alertRoutes = require('./routes/alerts');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001; // Using 3001 as React is usually on 3000

// Enable CORS
app.use(cors());

// Africa's Talking sends USSD data as form-urlencoded
// Also increase limit to support base64 images
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

// Routes
app.use('/ussd', ussdRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/alerts', alertRoutes);

app.get('/', (req, res) => {
    res.send('AgriBuddy backend is running. USSD endpoint is at /ussd and diagnostics at /api/diagnosis');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
