// index.js

require('dotenv').config(); // Load .env file
const express = require('express');
const db = require('./db'); // Initialize database connection
const deviceRoutes = require('./src/routes/device.routes');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Body parser for JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);

app.get('/', (req, res) => {
    res.send('Guardimoto API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});