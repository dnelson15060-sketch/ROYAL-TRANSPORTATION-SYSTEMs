const express = require('express');
const { body, param } = require('express-validator');

const validate = require('../middleware/validate');
const { authenticate, requireRole } = require('../middleware/auth');
const AppError = require('../middleware/AppError');
const { ROLES, ERROR_CODES } = require('../config/constants');
const studentService = require('../services/studentService');

const router = express.Router();

router.use(authenticate);

/**
 * GET /students
 */
router.get('/', requireRole(ROLES.ADMIN), async (req, res, next) => {
  try {
    const { parentId, routeId } = req.query;
    const students = await studentService.listStudents({ parentId, routeId });
    res.status(200).json({ success: true, data: students });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /students
 */
router.post(
  '/',
  requireRole(ROLES.ADMIN),
  [
    body('name').isString().notEmpty().withMessage('name is required'),
    body('parentId').isString().notEmpty().withMessage('parentId is required'),
    body('routeId').optional().isString(),
    body('grade').optional().isString(),
    body('school').optional().isString(),
    body('seatNumber').optional(),
    body('status').optional().isIn(['active', 'inactive']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const student = await studentService.createStudent(req.body);
      res.status(201).json({ success: true, data: student });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /students/:id
 */
router.get('/:id', [param('id').isString().notEmpty()], validate, async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Student not found');
    }
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /students/:id
 */
router.put(
  '/:id',
  requireRole(ROLES.ADMIN),
  [
    param('id').isString().notEmpty(),
    body('name').optional().isString(),
    body('routeId').optional().isString(),
    body('grade').optional().isString(),
    body('school').optional().isString(),
    body('seatNumber').optional(),
    body('status').optional().isIn(['active', 'inactive']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const student = await studentService.updateStudent(req.params.id, req.body);
      if (!student) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Student not found');
      }
      res.status(200).json({ success: true, data: student });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /students/:id
 */
router.delete(
  '/:id',
  requireRole(ROLES.ADMIN),
  [param('id').isString().notEmpty()],
  validate,
  async (req, res, next) => {
    try {
      const student = await studentService.getStudentById(req.params.id);
      if (!student) {
        throw new AppError(404, ERROR_CODES.NOT_FOUND, 'Student not found');
      }
      await studentService.deleteStudent(req.params.id);
      res.status(200).json({ success: true, data: { id: req.params.id, deleted: true } });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
