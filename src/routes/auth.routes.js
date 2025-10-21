import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const { registerUser, loginUser, logoutUser } = authController;

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.post('/logout', verifyAppToken, logoutUser);

export default router;
