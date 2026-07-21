const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const { ROLES, ATTENDANCE_STATUS } = require('../config/constants');
const attendanceService = require('../services/attendanceService');

const router = express.Router();

router.use(authenticate);

/**
 * POST /attendance
 */
router.post(
  '/',
  requireRole(ROLES.DRIVER),
  [
    body('routeId').isString().notEmpty().withMessage('routeId is required'),
    body('date').isISO8601().withMessage('date must be a valid ISO 8601 date'),
    body('studentId').isString().notEmpty().withMessage('studentId is required'),
    body('status')
      .isIn(Object.values(ATTENDANCE_STATUS))
      .withMessage(`status must be one of: ${Object.values(ATTENDANCE_STATUS).join(', ')}`),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { routeId, date, studentId, status } = req.body;
      const record = await attendanceService.markAttendance({
        routeId,
        date,
        studentId,
        status,
        markedBy: req.user.uid,
      });
      res.status(201).json({ success: true, data: record });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /attendance/student/:studentId
 * NOTE: registered before the generic /:routeId/:date route so that the
 * literal "student" segment is not mistakenly captured as a routeId.
 */
router.get(
  '/student/:studentId',
  requireRole(ROLES.PARENT, ROLES.ADMIN),
  [param('studentId').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const records = await attendanceService.getAttendanceForStudent(req.params.studentId);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /attendance/:routeId/:date
 */
router.get(
  '/:routeId/:date',
  requireRole(ROLES.ADMIN, ROLES.DRIVER, ROLES.PARENT),
  [param('routeId').isString().notEmpty(), param('date').isISO8601()],
  validate,
  async (req, res, next) => {
    try {
      const { routeId, date } = req.params;
      const records = await attendanceService.getAttendanceForRouteAndDate(routeId, date);
      res.status(200).json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
