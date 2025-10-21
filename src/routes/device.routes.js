import { Router } from 'express';
import deviceController from '../controllers/device.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const {
  createDevice,
  getDevices,
  getSingleDevice,
  updateDevice,
  deleteDevice
} = deviceController;

// Apply middleware globally to all routes
// router.use(verifyAppToken);

// CRUD endpoints
router.post('/', createDevice);
router.get('/', getDevices);
router.get('/:id', getSingleDevice);
router.put('/:id', updateDevice);
router.delete('/:id', deleteDevice);

export default router;
