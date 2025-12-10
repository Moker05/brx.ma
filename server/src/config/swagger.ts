/**
 * Swagger API Documentation Configuration
 */
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BRX.MA API Documentation',
      version: '1.0.0',
      description: 'API documentation for BRX.MA - Bourse de Casablanca Trading Platform',
      contact: {
        name: 'BRX.MA Team',
        email: 'support@brx.ma',
        url: 'https://brx.ma',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.brx.ma',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT access token for authentication',
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'HTTP-only cookie with refresh token',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            emailVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Stock: {
          type: 'object',
          properties: {
            symbol: { type: 'string', example: 'ATW' },
            name: { type: 'string', example: 'Attijariwafa Bank' },
            price: { type: 'number', example: 450.5 },
            change: { type: 'number', example: 2.5 },
            changePercent: { type: 'number', example: 0.56 },
            volume: { type: 'number', example: 125000 },
            marketCap: { type: 'number', example: 45000000000 },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
            error: { type: 'string' },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication required',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Authentication required',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Resource not found',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
              example: {
                success: false,
                message: 'Validation failed',
                errors: ['Invalid email format'],
              },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints',
      },
      {
        name: 'Stocks',
        description: 'BVC stock market data and operations',
      },
      {
        name: 'Portfolio',
        description: 'User portfolio management',
      },
      {
        name: 'Watchlist',
        description: 'Stock watchlist operations',
      },
      {
        name: 'Trading',
        description: 'Trading operations (buy/sell)',
      },
      {
        name: 'OPCVM',
        description: 'OPCVM (mutual funds) data',
      },
      {
        name: 'Crypto',
        description: 'Cryptocurrency market data',
      },
      {
        name: 'Social',
        description: 'Social features (posts, comments, leaderboard)',
      },
      {
        name: 'Monitoring',
        description: 'Health checks and monitoring',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(options);
