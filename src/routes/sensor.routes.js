// routes/sensorLogRoutes.js
const express = require('express');
const router = express.Router();
const sensorLogController = require('../controllers/sensor.controller');

router.post('/', sensorLogController.createSensorLog);
router.get('/', sensorLogController.getSensorLogsPaginated);
router.get('/:log_id', sensorLogController.getSensorLogById);
router.get('/device/:device_id', sensorLogController.getSensorLogsByDevice);
router.delete('/:log_id', sensorLogController.deleteSensorLog);

module.exports = router;
