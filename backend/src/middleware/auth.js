const { admin, firestore } = require('../config/firebase');
const { COLLECTIONS, ERROR_CODES } = require('../config/constants');
const AppError = require('./AppError');

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * (expected format: a "Bearer" scheme followed by the token), then loads
 * the corresponding user document from Firestore to attach role information
 * to the request.
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Missing or invalid Authorization header');
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(token);
    } catch (err) {
      throw new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Invalid or expired authentication token');
    }

    let role = decoded.role || null;
    let userRecord = null;

    try {
      const userDoc = await firestore.collection(COLLECTIONS.USERS).doc(decoded.uid).get();
      if (userDoc.exists) {
        userRecord = userDoc.data();
        role = userRecord.role || role;
      }
    } catch (err) {
      // If Firestore lookup fails we still allow the request to proceed
      // with whatever role information came from the token claims.
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email || (userRecord && userRecord.email) || null,
      role,
    };

    next();
  } catch (err) {
    next(err);
  }
}

/**
 * Middleware factory that restricts a route to the given roles.
 * Usage: requireRole('admin', 'driver')
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, ERROR_CODES.UNAUTHORIZED, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          403,
          ERROR_CODES.FORBIDDEN,
          'You do not have permission to perform this action'
        )
      );
    }
    return next();
  };
}

module.exports = { authenticate, requireRole };
