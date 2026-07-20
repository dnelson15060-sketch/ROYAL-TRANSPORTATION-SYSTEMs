const { body, validationResult } = require('express-validator');

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Authentication validators
const validateEmail = () => body('email')
  .isEmail()
  .normalizeEmail()
  .withMessage('Invalid email address');

const validatePassword = () => body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
  .withMessage('Password must contain uppercase, lowercase, number, and special character');

const validatePhone = () => body('phone')
  .matches(/^\+?[1-9]\d{1,14}$/)
  .withMessage('Invalid phone number');

const validateFirstName = () => body('firstName')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('First name must be 2-50 characters');

const validateLastName = () => body('lastName')
  .trim()
  .isLength({ min: 2, max: 50 })
  .withMessage('Last name must be 2-50 characters');

const validateRole = () => body('role')
  .isIn(['parent', 'driver', 'student', 'admin'])
  .withMessage('Invalid role');

const validateOTP = () => body('otp')
  .matches(/^\d{6}$/)
  .withMessage('OTP must be 6 digits');

module.exports = {
  validate,
  validateEmail,
  validatePassword,
  validatePhone,
  validateFirstName,
  validateLastName,
  validateRole,
  validateOTP
};
