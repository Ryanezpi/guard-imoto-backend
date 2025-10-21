require('dotenv').config(); // Load .env file
const express = require('express');
const db = require('./db'); // Initialize database connection
const authRoutes = require('./src/routes/auth.routes');
const deviceRoutes = require('./src/routes/device.routes');
const userRoutes = require('./src/routes/user.routes');
const configRoutes = require('./src/routes/config.routes');
const alertRoutes = require('./src/routes/alert.routes');
const sensorRoutes = require('./src/routes/sensor.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Body parser for JSON requests

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/user', userRoutes);
app.use('/api', configRoutes);
app.use('/api', sensorRoutes);
app.use('/api', alertRoutes);


app.get('/', (req, res) => {
    res.send('Guardimoto API is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});