const express = require('express');
const { body } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const authService = require('../services/authService');
const userService = require('../services/userService');

const router = express.Router();

/**
 * POST /auth/register
 * Creates the Firestore user document for an account that has already
 * been created in Firebase Authentication (uid supplied by the client
 * after a successful Firebase Auth sign-up).
 */
router.post(
  '/register',
  [
    body('uid').isString().notEmpty().withMessage('uid is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('name').isString().notEmpty().withMessage('name is required'),
    body('role')
      .isIn(Object.values(ROLES))
      .withMessage(`role must be one of: ${Object.values(ROLES).join(', ')}`),
    body('phone').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { uid, email, name, role, phone } = req.body;
      const user = await authService.createUserDocument({ uid, email, name, role, phone });
      res.status(201).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /auth/refresh
 * Validates the Firebase ID token supplied in the Authorization header
 * and returns the associated Firestore user profile.
 */
router.post('/refresh', authenticate, async (req, res, next) => {
  try {
    const user = await userService.getUserByUid(req.user.uid);
    if (!user) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'User profile not found');
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /auth/me
 * Returns the profile of the currently authenticated user.
 */
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await userService.getUserByUid(req.user.uid);
    if (!user) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'User profile not found');
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
