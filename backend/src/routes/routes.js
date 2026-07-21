const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const routeService = require('../services/routeService');

const router = express.Router();

router.use(authenticate);

/**
 * GET /routes
 */
router.get('/', requireRole(ROLES.ADMIN, ROLES.DRIVER), async (req, res, next) => {
  try {
    const routes = await routeService.listRoutes();
    res.status(200).json({ success: true, data: routes });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /routes
 */
router.post(
  '/',
  requireRole(ROLES.ADMIN),
  [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('driverId').optional().isString(),
    body('busId').optional().isString(),
    body('stops').optional().isArray(),
    body('studentIds').optional().isArray(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json({ success: true, data: route });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /routes/:id
 */
router.get('/:id', [param('id').isString().notEmpty()], validate, async (req, res, next) => {
  try {
    const route = await routeService.getRouteById(req.params.id);
    if (!route) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
    }
    res.status(200).json({ success: true, data: route });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /routes/:id
 */
router.put(
  '/:id',
  requireRole(ROLES.ADMIN),
  [
    param('id').isString().notEmpty(),
    body('name').optional().isString(),
    body('driverId').optional().isString(),
    body('busId').optional().isString(),
    body('stops').optional().isArray(),
    body('studentIds').optional().isArray(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.updateRoute(req.params.id, req.body);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      res.status(200).json({ success: true, data: route });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /routes/:id
 */
router.delete(
  '/:id',
  requireRole(ROLES.ADMIN),
  [param('id').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      await routeService.deleteRoute(req.params.id);
      res.status(200).json({ success: true, data: { id: req.params.id, deleted: true } });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /routes/:id/start
 */
router.post(
  '/:id/start',
  requireRole(ROLES.DRIVER),
  [param('id').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      const updated = await routeService.startRoute(req.params.id);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /routes/:id/stop
 */
router.post(
  '/:id/stop',
  requireRole(ROLES.DRIVER),
  [param('id').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      const updated = await routeService.stopRoute(req.params.id);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /routes/:id/assign-driver
 */
router.post(
  '/:id/assign-driver',
  requireRole(ROLES.ADMIN),
  [param('id').isString().notEmpty(), body('driverId').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      const updated = await routeService.assignDriver(req.params.id, req.body.driverId);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /routes/:id/assign-students
 */
router.post(
  '/:id/assign-students',
  requireRole(ROLES.ADMIN),
  [
    param('id').isString().notEmpty(),
    body('studentIds').isArray().withMessage('studentIds must be an array'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Route not found');
      }
      const updated = await routeService.assignStudents(req.params.id, req.body.studentIds);
      res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
