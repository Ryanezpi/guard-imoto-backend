import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import userController from '../controllers/user.controller.js';
import verifyAppToken from '../middlewares/auth.middleware.js';

const router = Router();
const { updateUserProfile } = userController;

const upload = multer({ storage: memoryStorage() });

// Protected routes only
router.use(verifyAppToken);

// User routes
router.put('/profile', upload.single('profile_picture'), updateUserProfile);

export default router;
