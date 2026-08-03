const request = require('supertest');
const createApp = require('../src/app');

describe('POST /api/v1/auth/register', () => {
  const app = createApp();

  it('should return 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({});

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(Array.isArray(res.body.error.details)).toBe(true);
  });

  it('should return 422 when role is invalid', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      uid: 'user-1',
      email: 'user@example.com',
      name: 'Test User',
      role: 'superadmin',
    });

    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
  });

  it('should create a user document for a valid payload', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      uid: 'user-1',
      email: 'user@example.com',
      name: 'Test User',
      role: 'parent',
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toMatchObject({
      uid: 'user-1',
      email: 'user@example.com',
      name: 'Test User',
      role: 'parent',
    });
  });
});

describe('GET /api/v1/auth/me', () => {
  const app = createApp();

  it('should return 401 without an Authorization header', async () => {
    const res = await request(app).get('/api/v1/auth/me');

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
  });
});
