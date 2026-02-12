const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');

let authToken;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'Password123'
    });
  
  authToken = res.body.data.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Exercise Endpoints', () => {
  let exerciseId;

  describe('GET /api/exercises', () => {
    it('should get all exercises', async () => {
      const res = await request(app)
        .get('/api/exercises');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('POST /api/exercises', () => {
    it('should create exercise when authenticated', async () => {
      const res = await request(app)
        .post('/api/exercises')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Exercise',
          category: 'strength',
          muscleGroups: ['chest'],
          equipment: ['barbell'],
          difficulty: 'beginner'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      
      exerciseId = res.body.data._id;
    });
  });

  describe('GET /api/exercises/:id', () => {
    it('should get single exercise', async () => {
      const res = await request(app)
        .get(`/api/exercises/${exerciseId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data).toHaveProperty('name', 'Test Exercise');
    });
  });
});