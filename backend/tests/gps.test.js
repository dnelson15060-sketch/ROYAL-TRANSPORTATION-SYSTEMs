const request = require('supertest');
const createApp = require('../src/app');
const gpsService = require('../src/services/gpsService');

describe('POST /api/v1/gps/track', () => {
  const app = createApp();

  it('should return 401 when no Authorization header is provided', async () => {
    const res = await request(app).post('/api/v1/gps/track').send({
      routeId: 'route-1',
      latitude: 40.7128,
      longitude: -74.006,
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: expect.any(String),
        details: null,
      },
    });
  });

  it('should return 401 when Authorization header is malformed', async () => {
    const res = await request(app)
      .post('/api/v1/gps/track')
      .set('Authorization', 'NotBearer sometoken')
      .send({ routeId: 'route-1', latitude: 40.7128, longitude: -74.006 });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});

describe('gpsService.isStaleLocation', () => {
  it('should return false for a timestamp within the staleness window', () => {
    const now = Date.now();
    const recentTimestamp = new Date(now - 30 * 1000).toISOString(); // 30s ago
    expect(gpsService.isStaleLocation(recentTimestamp, now)).toBe(false);
  });

  it('should return true for a timestamp older than 2 minutes', () => {
    const now = Date.now();
    const oldTimestamp = new Date(now - 3 * 60 * 1000).toISOString(); // 3 minutes ago
    expect(gpsService.isStaleLocation(oldTimestamp, now)).toBe(true);
  });

  it('should return true when no timestamp is provided', () => {
    expect(gpsService.isStaleLocation(null)).toBe(true);
    expect(gpsService.isStaleLocation(undefined)).toBe(true);
  });

  it('should return true for an invalid timestamp string', () => {
    expect(gpsService.isStaleLocation('not-a-date')).toBe(true);
  });

  it('should respect a custom staleness threshold', () => {
    const now = Date.now();
    const timestamp = new Date(now - 10 * 1000).toISOString(); // 10s ago
    expect(gpsService.isStaleLocation(timestamp, now, 5 * 1000)).toBe(true);
    expect(gpsService.isStaleLocation(timestamp, now, 20 * 1000)).toBe(false);
  });
});
