const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser } = require('../controllers/auth.controller');
const { verifyAppToken } = require('../middlewares/auth.middleware');

// Public route — no middleware needed yet
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyAppToken, logoutUser);

module.exports = router;
