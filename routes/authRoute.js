const express = require('express');
const { registerController, loginController, middlewarecheck } = require('../controllers/authController');
const { requireSignIn } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerController);

router.post('/login', loginController);

router.get('/test', requireSignIn, middlewarecheck);

module.exports = router