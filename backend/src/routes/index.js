const express = require('express');

const healthRouter = require('./health');
const authRouter = require('./auth');
const usersRouter = require('./users');
const driversRouter = require('./drivers');
const studentsRouter = require('./students');
const routesRouter = require('./routes');
const gpsRouter = require('./gps');
const attendanceRouter = require('./attendance');
const notificationsRouter = require('./notifications');

const router = express.Router();

// Health endpoints are mounted at the API root (no /health prefix needed
// since health.js already defines /health and /version).
router.use('/', healthRouter);

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/drivers', driversRouter);
router.use('/students', studentsRouter);
router.use('/routes', routesRouter);
router.use('/gps', gpsRouter);
router.use('/attendance', attendanceRouter);
router.use('/notifications', notificationsRouter);

module.exports = router;
