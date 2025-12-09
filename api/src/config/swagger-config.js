import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Dental OPD API Documentation',
    version: '1.0.0',
    description: 'API documentation for Dental OPD Management System',
    contact: {
      name: 'Praveenkumar Yennam',
      url: 'https://github.com/csteam',
    },
  },
  servers: [
    {
      url: 'http://localhost:4017/api/',
      description: 'Local server',
    },
    {
      url: 'https://opd-v2.keepsmiles.in/api/',
      description: 'Development server',
    }
  ],
  tags: [
    {
      name: 'Allergies',
      description: 'Allergies management endpoints'
    },
    {
      name: 'Communication Groups',
      description: 'Communication group management endpoints'
    },
    {
      name: 'Patient Tags',
      description: 'Patient tags management endpoints'
    },
    {
      name: 'Chairs',
      description: 'Chairs management endpoints'
    },
    {
      name: 'Feedback Questions',
      description: 'Feedback questions management endpoints'
    },
    {
      name: 'Banks',
      description: 'Bank accounts management endpoints'
    },
    {
      name: 'Doctors',
      description: 'Doctors management endpoints'
    },
    {
      name: 'Doctor Timings',
      description: 'Doctor timings management endpoints'
    }
  ]
};

const options = {
  definition: swaggerDefinition,
  apis: [
    'docs/swagger/*.yaml',
    'src/routes/**/*.route.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export {
  swaggerSpec
};

