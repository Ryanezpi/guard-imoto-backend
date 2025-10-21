const express = require('express');
const router = express.Router();
const deviceConfig =  require('../controllers/config.controller');

// CRUD endpoints
router.post('/', deviceConfig.createDeviceConfig);
router.get('/', deviceConfig.getDeviceConfigs);
router.get('/:device_id', deviceConfig.getDeviceConfig);
router.put('/:device_id', deviceConfig.updateDeviceConfig);
router.delete('/:id', deviceConfig.deleteDeviceConfig);

module.exports = router;
