const db = require('../../db');

const SensorLog = {
  create: (data, callback) => {
    const {
      device_id, latitude, longitude, gyroscope_x, gyroscope_y, gyroscope_z, rfid_tag
    } = data;

    db.run(`
      INSERT INTO Device_Sensor_Log (
        device_id, latitude, longitude, gyroscope_x, gyroscope_y, gyroscope_z, rfid_tag
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [device_id, latitude, longitude, gyroscope_x, gyroscope_y, gyroscope_z, rfid_tag], callback);
  },

  getAllPaginated: (page, limit, callback) => {
    const offset = (page - 1) * limit;
    db.all(`
      SELECT * FROM Device_Sensor_Log
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `, [limit, offset], callback);
  },

  getById: (log_id, callback) => {
    db.get(`SELECT * FROM Device_Sensor_Log WHERE log_id = ?`, [log_id], callback);
  },

  getByDeviceId: (device_id, page, limit, callback) => {
    const offset = (page - 1) * limit;
    db.all(`
      SELECT * FROM Device_Sensor_Log
      WHERE device_id = ?
      ORDER BY timestamp DESC
      LIMIT ? OFFSET ?
    `, [device_id, limit, offset], callback);
  },

  delete: (log_id, callback) => {
    db.run(`DELETE FROM Device_Sensor_Log WHERE log_id = ?`, [log_id], callback);
  }
};

module.exports = SensorLog;
