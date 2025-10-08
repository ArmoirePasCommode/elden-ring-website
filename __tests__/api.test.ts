import request from 'supertest';
import app from '../server/index';

describe('API root', () => {
  it('GET /api should return status json', async () => {
    const res = await request(app).get('/api');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(Array.isArray(res.body.routes)).toBe(true);
  });
});


