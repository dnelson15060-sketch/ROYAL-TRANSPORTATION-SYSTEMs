const express = require('express');
const AuthController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const {
  validate,
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateRole,
  validateOTP
} = require('../middleware/validators');

const router = express.Router();

// Public routes
router.post('/register',
  validateEmail(),
  validatePassword(),
  validatePhone(),
  validateFirstName(),
  validateLastName(),
  validateRole(),
  validate,
  AuthController.register
);

router.post('/login',
  validateEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
  AuthController.login
);

router.post('/verify-otp',
  validatePhone(),
  validateOTP(),
  validate,
  AuthController.verifyOTP
);

// Protected routes
router.post('/refresh-token',
  authMiddleware,
  AuthController.refreshToken
);

router.post('/logout',
  authMiddleware,
  AuthController.logout
);

module.exports = router;
