const db = require('../../db');

const Alert = {
  create: (data, callback) => {
    const { device_id, type, message } = data;
    db.run(
      `
      INSERT INTO Alert_Log (device_id, type, message, created_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `,
      [device_id, type, message],
      callback
    );
  },

  getByDeviceId: (device_id, callback) => {
    db.all(
      `
      SELECT * FROM Alert_Log
      WHERE device_id = ?
      ORDER BY created_at DESC
      `,
      [device_id],
      callback
    );
  }
};

module.exports = Alert;
