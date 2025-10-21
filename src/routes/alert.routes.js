import { Router } from 'express';
import alertController from '../controllers/alert.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const { createAlert, getAlertsByDevice } = alertController;

// router.use(verifyAppToken);

// Alert routes
router.post('/alerts', createAlert);
router.get('/alerts/:id', getAlertsByDevice);

export default router;
