const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { verifyAppToken } = require('../middlewares/auth.middleware');

router.use(verifyAppToken);

router.post('/', deviceController.createDevice);           // C: Create
router.get('/', deviceController.getDevices);            // R: List with Pagination
router.get('/:id', deviceController.getSingleDevice);    // R: Single
router.put('/:id', deviceController.updateDevice);         // U: Update
router.delete('/:id', deviceController.deleteDevice);      // D: Delete

module.exports = router;