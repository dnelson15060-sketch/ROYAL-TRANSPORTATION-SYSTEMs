const request = require('supertest');
const createApp = require('../src/app');

describe('GET /api/v1/health', () => {
  const app = createApp();

  it('should return 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
    expect(res.body).toHaveProperty('version');
  });
});

describe('GET /api/v1/version', () => {
  const app = createApp();

  it('should return version info', async () => {
    const res = await request(app).get('/api/v1/version');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('version');
    expect(res.body).toHaveProperty('environment');
    expect(res.body).toHaveProperty('uptime');
  });
});
