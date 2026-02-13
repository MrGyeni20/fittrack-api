const request = require('supertest');
const app = require('../src/app');
const mongoose = require('mongoose');
const Workout = require('../src/models/Workout');

let authToken;
let userId;
let exerciseId;
let workoutId;

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

  const exerciseRes = await request(app).get('/api/exercises');
  if (exerciseRes.body.data.length > 0) {
    exerciseId = exerciseRes.body.data[0]._id;
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Workout Endpoints', () => {
  
  describe('GET /api/workouts', () => {
    it('should get all workouts for authenticated user', async () => {
      const res = await request(app)
        .get('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app).get('/api/workouts');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('POST /api/workouts', () => {
    it('should create workout when authenticated', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Workout',
          type: 'strength',
          exercises: [
            {
              exerciseId: exerciseId,
              exerciseName: 'Test Exercise',
              sets: [
                { setNumber: 1, reps: 10, weightKg: 50, completed: true }
              ]
            }
          ],
          totalDurationMinutes: 45,
          rating: 5
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      
      workoutId = res.body.data._id;
    });

    it('should fail with invalid data', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test',
          type: 'invalid_type'
        });

      expect(res.statusCode).toBe(400);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/workouts')
        .send({
          name: 'Test Workout',
          type: 'strength',
          exercises: []
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/workouts/:id', () => {
    it('should get single workout by id', async () => {
      const res = await request(app)
        .get(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('name', 'Test Workout');
    });

    it('should return 404 for non-existent workout', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/workouts/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(404);
    });

    it('should return 400 for invalid id format', async () => {
      const res = await request(app)
        .get('/api/workouts/invalid123')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(400);
    });
  });

  describe('PUT /api/workouts/:id', () => {
    it('should update workout when authenticated', async () => {
      const res = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Workout',
          type: 'strength',
          exercises: [
            {
              exerciseId: exerciseId,
              exerciseName: 'Test Exercise',
              sets: [
                { setNumber: 1, reps: 12, weightKg: 55, completed: true }
              ]
            }
          ],
          rating: 4
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .put(`/api/workouts/${workoutId}`)
        .send({ rating: 3 });

      expect(res.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/workouts/:id', () => {
    it('should delete workout when authenticated', async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workoutId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .delete(`/api/workouts/${workoutId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe('GET /api/workouts/stats', () => {
    it('should get workout statistics', async () => {
      const res = await request(app)
        .get('/api/workouts/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('totalWorkouts');
      expect(res.body.data).toHaveProperty('totalMinutes');
      expect(res.body.data).toHaveProperty('totalCalories');
    });
  });
});