const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alert.controller');

router.post('/alerts', alertController.createAlert);
router.get('/alerts/:id', alertController.getAlertsByDevice);

module.exports = router;
