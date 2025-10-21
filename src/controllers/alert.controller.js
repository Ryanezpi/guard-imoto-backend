import Alert from '../models/alert.model.js';
import pubnub from '../utils/pubnub.js';

// ✅ Create alert + broadcast via PubNub
async function createAlert(req, res) {
  try {
    const { device_id, type, message } = req.body;

    Alert.create({ device_id, type, message }, function (err) {
      if (err) return res.status(500).json({ error: 'Database error' });

      // Broadcast alert to PubNub channel
      pubnub.publish({
        channel: 'alerts',
        message: { device_id, type, message },
      });

      return res.status(201).json({
        message: 'Alert logged and broadcasted successfully'
      });
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// ✅ Get alerts by device
async function getAlertsByDevice(req, res) {
  try {
    const { id } = req.params;

    Alert.getByDeviceId(id, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      return res.status(200).json(rows);
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default {
  createAlert,
  getAlertsByDevice
};
