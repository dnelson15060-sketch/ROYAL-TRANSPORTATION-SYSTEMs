const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const userService = require('../services/userService');

const router = express.Router();

router.use(authenticate);

/**
 * GET /users/profile
 */
router.get('/profile', async (req, res, next) => {
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
 * PUT /users/profile
 */
router.put(
  '/profile',
  [
    body('name').optional().isString(),
    body('phone').optional().isString(),
    body('fcmToken').optional().isString(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const user = await userService.updateUser(req.user.uid, req.body);
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /users/children
 */
router.get('/children', requireRole(ROLES.PARENT), async (req, res, next) => {
  try {
    const children = await userService.getChildrenForParent(req.user.uid);
    res.status(200).json({ success: true, data: children });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users
 */
router.get('/', requireRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const { role } = req.query;
    const users = await userService.listUsers({ role });
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /users/:id
 */
router.get(
  '/:id',
  requireRole(ROLES.ADMIN),
  [param('id').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const user = await userService.getUserByUid(req.params.id);
      if (!user) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'User not found');
      }
      res.status(200).json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
