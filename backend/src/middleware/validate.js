const { validationResult } = require('express-validator');
const { ERROR_CODES } = require('../config/constants');

/**
 * Runs express-validator validation chains and, if any errors were
 * collected, short-circuits the request with a standardized error
 * response. Otherwise passes control to the next handler.
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: {
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Validation failed',
        details: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      },
    });
  }
  return next();
}

module.exports = validate;
