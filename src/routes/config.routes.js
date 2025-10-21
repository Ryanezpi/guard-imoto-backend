import { Router } from 'express';
import configController from '../controllers/config.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const {
  createDeviceConfig,
  getDeviceConfigs,
  getDeviceConfig,
  updateDeviceConfig,
  deleteDeviceConfig
} = configController;

// router.use(verifyAppToken);

// CRUD endpoints
router.post('/', createDeviceConfig);
router.get('/', getDeviceConfigs);
router.get('/:device_id', getDeviceConfig);
router.put('/:device_id', updateDeviceConfig);
router.delete('/:id', deleteDeviceConfig);

export default router;
