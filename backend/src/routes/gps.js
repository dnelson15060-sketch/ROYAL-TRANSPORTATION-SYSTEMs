const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES } = require('../config/constants');
const gpsService = require('../services/gpsService');

const router = express.Router();

router.use(authenticate);

/**
 * POST /gps/track
 * Driver reports the current location of their route/bus.
 */
router.post(
  '/track',
  requireRole(ROLES.DRIVER),
  [
    body('routeId').isString().notEmpty().withMessage('routeId is required'),
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('latitude must be between -90 and 90'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('longitude must be between -180 and 180'),
    body('accuracy').optional().isFloat({ min: 0 }),
    body('speed').optional().isFloat({ min: 0 }),
    body('heading').optional().isFloat({ min: 0, max: 360 }),
    body('timestamp').optional().isISO8601(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { routeId, latitude, longitude, accuracy, speed, heading } = req.body;
      await gpsService.trackLocation({
        routeId,
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
        driverId: req.user.uid,
      });
      res.status(201).json({ success: true, eta: null });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /gps/location/:routeId
 */
router.get(
  '/location/:routeId',
  requireRole(ROLES.PARENT, ROLES.ADMIN, ROLES.DRIVER),
  [param('routeId').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const location = await gpsService.getLatestLocation(req.params.routeId);

      if (!location) {
        return res.status(200).json({
          success: true,
          data: {
            routeId: req.params.routeId,
            latitude: null,
            longitude: null,
            accuracy: null,
            speed: null,
            timestamp: null,
            isStale: true,
            eta: null,
          },
        });
      }

      const isStale = gpsService.isStaleLocation(location.timestamp);

      return res.status(200).json({
        success: true,
        data: {
          routeId: location.routeId,
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy,
          speed: location.speed,
          timestamp: location.timestamp,
          isStale,
          eta: null,
        },
      });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
