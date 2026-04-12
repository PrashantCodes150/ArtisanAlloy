const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'F Jewelry E-Commerce API',
      version: '1.0.0',
      description: 'API documentation for F Jewelry E-Commerce Platform',
      license: {
        name: 'MIT',
        url: 'http://github.com/gruntjs/grunt/blob/master/LICENSE-MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api/v1',
        description: 'Development server',
      },
      {
        url: 'https://api.f-jewelry.com/api/v1',
        description: 'Production server',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'], // files containing annotations as above
};

module.exports = options;