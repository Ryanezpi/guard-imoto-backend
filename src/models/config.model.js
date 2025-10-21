import db from '../../db.js';

const DeviceConfig = {
  create: (data, callback) => {
    const {
      device_id, relay_ignition, relay_siren,
      gyroscope_sensitivity, sms_enabled, rfid_required
    } = data;

    db.run(`
      INSERT INTO Device_Config (
        device_id, relay_ignition, relay_siren,
        gyroscope_sensitivity, sms_enabled, rfid_required
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [device_id, relay_ignition, relay_siren, gyroscope_sensitivity, sms_enabled, rfid_required], callback);
  },

  getAllPaginated: (page, limit, callback) => {
    const offset = (page - 1) * limit;
    db.all(`SELECT * FROM Device_Config LIMIT ? OFFSET ?`, [limit, offset], callback);
  },

  getByDeviceId: (device_id, callback) => {
    db.get(`SELECT * FROM Device_Config WHERE device_id = ?`, [device_id], callback);
  },

  update: (device_id, data, callback) => {
    const {
      relay_ignition, relay_siren,
      gyroscope_sensitivity, sms_enabled, rfid_required
    } = data;

    db.run(`
      UPDATE Device_Config
      SET relay_ignition = ?, relay_siren = ?, gyroscope_sensitivity = ?,
          sms_enabled = ?, rfid_required = ?, updated_at = CURRENT_TIMESTAMP
      WHERE device_id = ?
    `, [relay_ignition, relay_siren, gyroscope_sensitivity, sms_enabled, rfid_required, device_id], callback);
  },

  delete: (id, callback) => {
    db.run(`DELETE FROM Device_Config WHERE config_id = ?`, [id], callback);
  }
};

export default DeviceConfig;
