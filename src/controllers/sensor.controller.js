const SensorLog = require('../models/sensor.model');

// ✅ Create sensor log
async function createSensorLog(req, res) {
  try {
    const { device_id, latitude, longitude, gyroscope_x, gyroscope_y, gyroscope_z, rfid_tag } = req.body;

    SensorLog.create(
      { device_id, latitude, longitude, gyroscope_x, gyroscope_y, gyroscope_z, rfid_tag },
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(201).json({ message: 'Sensor data logged successfully' });
      }
    );
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ✅ Get all logs with pagination
async function getSensorLogsPaginated(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    SensorLog.getAllPaginated(page, limit, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ page, limit, data: rows });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ✅ Get single log by ID
async function getSensorLogById(req, res) {
  try {
    const { log_id } = req.params;

    SensorLog.getById(log_id, (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Sensor log not found' });
      return res.status(200).json(row);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ✅ Get logs by Device ID (paginated)
async function getSensorLogsByDevice(req, res) {
  try {
    const { device_id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    SensorLog.getByDeviceId(device_id, page, limit, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ device_id, page, limit, data: rows });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ✅ Delete log by ID
async function deleteSensorLog(req, res) {
  try {
    const { log_id } = req.params;

    SensorLog.delete(log_id, (err) => {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: 'Sensor log deleted successfully' });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createSensorLog,
  getSensorLogsPaginated,
  getSensorLogById,
  getSensorLogsByDevice,
  deleteSensorLog
};
