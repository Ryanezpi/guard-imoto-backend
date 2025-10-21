import DeviceModel from '../models/device.model.js';

// POST /api/devices
async function createDevice(req, res) {
    try {
        const userId = req.userId;
        const { serial, name } = req.body;
        if (!serial || !name) {
            return res.status(400).json({ message: "Missing serial or name." });
        }
        
        const deviceData = { serial, name, userId };
        const newDevice = await DeviceModel.create(deviceData);
        res.status(201).json(newDevice);
    } catch (error) {
        console.error("Error creating device:", error);
        res.status(500).json({ message: "Error creating device", details: error.message });
    }
};

// GET /api/devices (with pagination)
async function getDevices(req, res) {
    try {
        // Default to page 1, limit 10
        const userId = req.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const data = await DeviceModel.getAllByUserId(userId, page, limit);
        res.status(200).json(data);
    } catch (error) {
        console.error("Error getting devices:", error);
        res.status(500).json({ message: "Error retrieving devices", details: error.message });
    }
};

// GET /api/devices/:id
async function getSingleDevice(req, res) {
    try {
        const userId = req.userId;
        const deviceId = parseInt(req.params.id);
        const device = await DeviceModel.getById(deviceId, userId);

        if (!device) {
            return res.status(404).json({ message: "Device not found or not owned." });
        }
        res.status(200).json(device);
    } catch (error) {
        console.error("Error getting single device:", error);
        res.status(500).json({ message: "Error retrieving device", details: error.message });
    }
};

// PUT /api/devices/:id
async function updateDevice(req, res) {
    try {
        const userId = req.userId;
        const deviceId = parseInt(req.params.id);
        const updated = await DeviceModel.update(deviceId, userId, req.body);

        if (updated) {
            // Publish to PubNub
            pubnub.publish({
                channel: `device-status-${unique_serial_number}`,
                message: { unique_serial_number, battery_level, gsm_signal },
            });

            res.status(200).json({ message: "Device updated successfully." });
        } else {
            res.status(404).json({ message: "Device not found or not owned." });
        }
    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Error updating device", details: error.message });
    }
};

// DELETE /api/devices/:id
async function deleteDevice(req, res) {
    try {
        const userId = req.userId;
        const deviceId = parseInt(req.params.id);
        const deleted = await DeviceModel.delete(deviceId, userId);

        if (deleted) {
            res.status(200).json({ message: "Device successfully unpaired." });
        } else {
            res.status(404).json({ message: "Device not found or not owned." });
        }
    } catch (error) {
        console.error("Error deleting device:", error);
        res.status(500).json({ message: "Error un-pairing device", details: error.message });
    }
};

export default { createDevice, getDevices, getSingleDevice, updateDevice, deleteDevice };
