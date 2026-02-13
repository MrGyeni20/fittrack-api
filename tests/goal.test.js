const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Goal = require('../src/models/Goal');

let authToken;
let userId;
let goalId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'john.doe@fittrack.com',
      password: 'Password123'
    });
  
  authToken = loginRes.body.data.token;
  userId = loginRes.body.data._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Goal Endpoints', () => {
  
  describe('GET /api/goals', () => {
    it('should get all goals for authenticated user', async () => {
      const res = await request(app)
        .get('/api/goals')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/goals');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/goals', () => {
    it('should create goal when authenticated', async () => {
      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Weight Loss Goal',
          description: 'Lose weight for summer',
          type: 'weight-loss',
          targetMetric: {
            metricType: 'weight',
            currentValue: 90,
            targetValue: 80,
            unit: 'kg'
          },
          targetDate: '2026-06-01T00:00:00Z'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data).toHaveProperty('progress');
      
      goalId = res.body.data._id;
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Incomplete Goal'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail with invalid goal type', async () => {
      const res = await request(app)
        .post('/api/goals')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Goal',
          type: 'invalid_type',
          targetMetric: {
            metricType: 'weight',
            currentValue: 90,
            targetValue: 80,
            unit: 'kg'
          },
          targetDate: '2026-06-01'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/goals')
        .send({
          title: 'Test Goal',
          type: 'weight-loss'
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/goals/:id', () => {
    it('should get single goal by id', async () => {
      const res = await request(app)
        .get(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('title', 'Test Weight Loss Goal');
    });

    it('should return 404 for non-existent goal', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/goals/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const res = await request(app)
        .get('/api/goals/invalid123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PATCH /api/goals/:id/progress', () => {
    it('should update goal progress', async () => {
      const res = await request(app)
        .patch(`/api/goals/${goalId}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentValue: 85
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.progress).toBeGreaterThan(0);
    });

    it('should calculate progress correctly', async () => {
      const res = await request(app)
        .patch(`/api/goals/${goalId}/progress`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentValue: 85
        });

      expect(res.body.data.progress).toBe(50);
    });
  });

  describe('PUT /api/goals/:id', () => {
    it('should update goal when authenticated', async () => {
      const res = await request(app)
        .put(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Weight Loss Goal',
          description: 'Updated description',
          type: 'weight-loss',
          targetMetric: {
            metricType: 'weight',
            currentValue: 85,
            targetValue: 75,
            unit: 'kg'
          },
          targetDate: '2026-07-01T00:00:00Z'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .put(`/api/goals/${goalId}`)
        .send({ title: 'Updated Goal' });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/goals/:id', () => {
    it('should delete goal when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/goals/${goalId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .delete(`/api/goals/${goalId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/goals with filters', () => {
    it('should filter goals by status', async () => {
      const res = await request(app)
        .get('/api/goals?status=active')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});