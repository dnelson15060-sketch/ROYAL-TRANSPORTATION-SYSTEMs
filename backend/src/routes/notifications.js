const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const notificationService = require('../services/notificationService');

const router = express.Router();

router.use(authenticate);

/**
 * POST /notifications/send
 */
router.post(
  '/send',
  requireRole(ROLES.ADMIN),
  [
    body('userId').isString().notEmpty().withMessage('userId is required'),
    body('title').isString().notEmpty().withMessage('title is required'),
    body('body').isString().notEmpty().withMessage('body is required'),
    body('data').optional().isObject(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { userId, title, body: messageBody, data } = req.body;
      const notification = await notificationService.sendNotification({
        userId,
        title,
        body: messageBody,
        data,
      });
      res.status(201).json({ success: true, data: notification });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /notifications
 */
router.get('/', async (req, res, next) => {
  try {
    const notifications = await notificationService.listNotificationsForUser(req.user.uid);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /notifications/:id/read
 */
router.put('/:id/read', [param('id').isString().notEmpty()], validate, async (req, res, next) => {
  try {
    const notification = await notificationService.markNotificationRead(req.params.id);
    if (!notification) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Notification not found');
    }
    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
