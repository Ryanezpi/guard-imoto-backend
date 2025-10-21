import { Router } from 'express';
import sensorController from '../controllers/sensor.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const {
  createSensorLog,
  getSensorLogsPaginated,
  getSensorLogById,
  getSensorLogsByDevice,
  deleteSensorLog
} = sensorController;

// router.use(verifyAppToken);

// Sensor routes
router.post('/', createSensorLog);
router.get('/', getSensorLogsPaginated);
router.get('/:log_id', getSensorLogById);
router.get('/device/:device_id', getSensorLogsByDevice);
router.delete('/:log_id', deleteSensorLog);

export default router;
