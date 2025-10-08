import request from 'supertest';
import app from '../server/index';

const emulator = process.env.FIRESTORE_EMULATOR_HOST;

(emulator ? describe : describe.skip)('Demigods CRUD (Firestore emulator)', () => {
  let createdId: string | undefined;

  it('POST /api/demigods creates a demigod', async () => {
    const res = await request(app)
      .post('/api/demigods')
      .send({ name: 'Test Demigod', title: 'Lord', description: 'From tests' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id;
  });

  it('GET /api/demigods lists demigods', async () => {
    const res = await request(app).get('/api/demigods');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('PUT /api/demigods/:id updates a demigod', async () => {
    expect(createdId).toBeTruthy();
    const res = await request(app)
      .put(`/api/demigods/${createdId}`)
      .send({ title: 'Updated Lord' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title', 'Updated Lord');
  });

  it('DELETE /api/demigods/:id deletes a demigod', async () => {
    expect(createdId).toBeTruthy();
    const res = await request(app).delete(`/api/demigods/${createdId}`);
    expect(res.status).toBe(204);
  });
});


