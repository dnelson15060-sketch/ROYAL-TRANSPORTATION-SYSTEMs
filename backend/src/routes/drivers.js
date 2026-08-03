const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const driverService = require('../services/driverService');

const router = express.Router();

router.use(authenticate);

/**
 * GET /drivers/me/routes
 * NOTE: defined before /:id so "me" isn't captured as an id param.
 */
router.get('/me/routes', requireRole(ROLES.DRIVER), async (req, res, next) => {
  try {
    const routes = await driverService.getRoutesForDriverUser(req.user.uid);
    res.status(200).json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /drivers
 */
router.get('/', requireRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const drivers = await driverService.listDrivers();
    res.status(200).json({ success: true, data: drivers });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /drivers
 */
router.post(
  '/',
  requireRole(ROLES.ADMIN),
  [
    body('userId').isString().notEmpty().withMessage('userId is required'),
    body('licenseNumber').isString().notEmpty().withMessage('licenseNumber is required'),
    body('vehicleId').optional().isString(),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('status').optional().isIn(['active', 'inactive']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const driver = await driverService.createDriver(req.body);
      res.status(201).json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /drivers/:id
 */
router.get('/:id', [param('id').isString().notEmpty()], validate, async (req, res, next) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    if (!driver) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Driver not found');
    }
    res.status(200).json({ success: true, data: driver });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /drivers/:id
 */
router.put(
  '/:id',
  requireRole(ROLES.ADMIN),
  [
    param('id').isString().notEmpty(),
    body('licenseNumber').optional().isString(),
    body('vehicleId').optional().isString(),
    body('rating').optional().isFloat({ min: 0, max: 5 }),
    body('status').optional().isIn(['active', 'inactive']),
    body('assignedRoutes').optional().isArray(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const driver = await driverService.updateDriver(req.params.id, req.body);
      if (!driver) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Driver not found');
      }
      res.status(200).json({ success: true, data: driver });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
