const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'FitTrack API',
    description: 'Fitness & Workout Tracker API with authentication',
    version: '1.0.0'
  },
  host: 'fittrack-api-9t3c.onrender.com',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Enter your bearer token in the format: Bearer {token}'
    }
  },
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management' },
    { name: 'Exercises', description: 'Exercise management' },
    { name: 'Workouts', description: 'Workout tracking' },
    { name: 'Goals', description: 'Goal management' }
  ],
  definitions: {
    User: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Password123'
    },
    Exercise: {
      name: 'Bench Press',
      description: 'Chest exercise using barbell',
      category: 'strength',
      muscleGroups: ['chest', 'triceps', 'shoulders'],
      equipment: ['barbell', 'bench'],
      difficulty: 'intermediate',
      instructions: ['Lie on bench', 'Lower bar to chest', 'Press up']
    },
    Workout: {
      name: 'Chest Day',
      type: 'strength',
      date: '2026-02-11T10:00:00Z',
      exercises: [
        {
          exerciseId: '507f1f77bcf86cd799439011',
          exerciseName: 'Bench Press',
          sets: [
            { setNumber: 1, reps: 10, weightKg: 60, completed: true }
          ]
        }
      ],
      totalDurationMinutes: 45,
      caloriesBurned: 250,
      rating: 5
    },
    Goal: {
      title: 'Lose 10kg',
      description: 'Weight loss goal',
      type: 'weight-loss',
      targetMetric: {
        metricType: 'weight',
        currentValue: 90,
        targetValue: 80,
        unit: 'kg'
      },
      targetDate: '2026-05-11T00:00:00Z'
    }
  }
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated');
});