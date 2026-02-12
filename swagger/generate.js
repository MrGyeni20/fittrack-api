const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'FitTrack API',
    description: 'Fitness & Workout Tracker API with authentication',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  schemes: ['http', 'https'],
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
    { name: 'Exercises', description: 'Exercise management' }
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
    }
  }
};

const outputFile = './swagger/swagger.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated');
});