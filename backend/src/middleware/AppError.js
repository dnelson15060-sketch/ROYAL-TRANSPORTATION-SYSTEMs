/**
 * Custom application error carrying an HTTP status code and error code,
 * so route handlers can `throw new AppError(...)` and let the global
 * error handler format the response consistently.
 */
class AppError extends Error {
  constructor(statusCode, code, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

module.exports = AppError;
