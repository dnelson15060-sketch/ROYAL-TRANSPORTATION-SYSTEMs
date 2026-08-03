/**
 * Application-wide constants.
 */
const ROLES = Object.freeze({
  PARENT: 'parent',
  DRIVER: 'driver',
  ADMIN: 'admin',
});

const COLLECTIONS = Object.freeze({
  USERS: 'users',
  DRIVERS: 'drivers',
  STUDENTS: 'students',
  ROUTES: 'routes',
  BUSES: 'buses',
  LOCATIONS: 'locations',
  ATTENDANCE: 'attendance',
  NOTIFICATIONS: 'notifications',
});

const ATTENDANCE_STATUS = Object.freeze({
  PRESENT: 'present',
  ABSENT: 'absent',
});

const ROUTE_STATUS = Object.freeze({
  IDLE: 'idle',
  ACTIVE: 'active',
  COMPLETED: 'completed',
});

// A location report is considered stale if it is older than this many
// milliseconds (2 minutes), used by the GPS service to flag outdated pings.
const LOCATION_STALE_MS = 2 * 60 * 1000;

const ERROR_CODES = Object.freeze({
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  CONFLICT: 'CONFLICT',
});

module.exports = {
  ROLES,
  COLLECTIONS,
  ATTENDANCE_STATUS,
  ROUTE_STATUS,
  LOCATION_STALE_MS,
  ERROR_CODES,
};
