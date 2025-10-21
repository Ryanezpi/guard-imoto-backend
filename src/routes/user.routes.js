// routes/user.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const userController = require('../controllers/user.controller');
const verifyAppToken = require('../middlewares/auth.middleware');

router.use((req, res, next) => {
  console.log('verify middleware reached');
  verifyAppToken(req, res, next);
});

const upload = multer({ storage: multer.memoryStorage() });

router.put('/profile', upload.single('profile_picture'), userController.updateUserProfile);

module.exports = router;
