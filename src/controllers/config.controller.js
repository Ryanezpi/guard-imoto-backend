import DeviceConfig from '../models/config.model.js';

// Create new device configuration
async function createDeviceConfig(req, res) {
  try {
    const data = req.body;

    DeviceConfig.create(data, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(201).json({ message: 'Device config created successfully' });
    });
  } catch (error) {
    console.error('Error creating device config:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get device configuration by device_id
async function getDeviceConfig(req, res) {
  try {
    const { device_id } = req.params;

    DeviceConfig.getByDeviceId(device_id, function (err, row) {
      if (err) return res.status(500).json({ error: err.message });
      if (!row) return res.status(404).json({ error: 'Device config not found' });
      return res.status(200).json(row);
    });
  } catch (error) {
    console.error('Error retrieving device config:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Update device configuration
async function updateDeviceConfig(req, res) {
  try {
    const { device_id } = req.params;
    const data = req.body;

    DeviceConfig.update(device_id, data, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: 'Device config updated successfully' });
    });
  } catch (error) {
    console.error('Error updating device config:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete a device configuration
async function deleteDeviceConfig(req, res) {
  try {
    const { id } = req.params; // deleting by config_id for consistency
    DeviceConfig.delete(id, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json({ message: 'Device config deleted successfully' });
    });
  } catch (error) {
    console.error('Error deleting device config:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all device configs (paginated)
async function getDeviceConfigs(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    DeviceConfig.getAllPaginated(page, limit, function (err, rows) {
      if (err) return res.status(500).json({ error: err.message });
      return res.status(200).json(rows);
    });
  } catch (error) {
    console.error('Error fetching device configs:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default {
  createDeviceConfig,
  getDeviceConfig,
  updateDeviceConfig,
  deleteDeviceConfig,
  getDeviceConfigs,
};
