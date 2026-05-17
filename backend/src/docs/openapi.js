const openApiBase = {
  openapi: '3.0.3',
  info: {
    title: 'Notes API',
    version: '1.0.0',
    description: 'Multi-user notes service REST API',
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      RegisterRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 8 },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      Note: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          content: { type: 'string' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      ShareNoteRequest: {
        type: 'object',
        required: ['share_with_email'],
        properties: {
          share_with_email: { type: 'string', format: 'email' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      AboutResponse: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          'my features': {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
        },
      },
    },
  },
  paths: {
    '/': {
      get: {
        tags: ['Health'],
        summary: 'API status',
        responses: {
          200: {
            description: 'API is running',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register new user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          201: {
            description: 'User created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
    },
    '/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          200: {
            description: 'JWT token',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          401: {
            description: 'Invalid credentials',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
        },
      },
    },
    '/notes': {
      get: {
        tags: ['Notes'],
        summary: 'List notes for authenticated user',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of notes',
            content: {
              'application/json': {
                schema: { type: 'array', items: { $ref: '#/components/schemas/Note' } },
              },
            },
          },
        },
      },
      post: {
        tags: ['Notes'],
        summary: 'Create a note',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'content'],
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Note created',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
        },
      },
    },
    '/notes/{id}': {
      get: {
        tags: ['Notes'],
        summary: 'Get note by ID',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Note details',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
        },
      },
      put: {
        tags: ['Notes'],
        summary: 'Update a note',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  content: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Note updated',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Note' } } },
          },
        },
      },
      delete: {
        tags: ['Notes'],
        summary: 'Delete a note',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 204: { description: 'Note deleted' } },
      },
    },
    '/notes/{id}/share': {
      post: {
        tags: ['Notes'],
        summary: 'Share note with another user',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ShareNoteRequest' } } },
        },
        responses: {
          200: {
            description: 'Note shared',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } },
          },
        },
      },
    },
    '/search': {
      get: {
        tags: ['Search'],
        summary: 'Full-text search notes',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer' } },
          { name: 'limit', in: 'query', schema: { type: 'integer' } },
        ],
        responses: { 200: { description: 'Search results' } },
      },
    },
    '/about': {
      get: {
        tags: ['About'],
        summary: 'About the API author and features',
        responses: {
          200: {
            description: 'About information',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AboutResponse' },
              },
            },
          },
        },
      },
    },
    '/openapi.json': {
      get: {
        tags: ['Documentation'],
        summary: 'OpenAPI specification',
        responses: { 200: { description: 'OpenAPI JSON document' } },
      },
    },
  },
};

/** Build spec with the current host so Swagger "Try it out" hits the right server. */
export const getOpenApiSpec = (baseUrl) => ({
  ...openApiBase,
  servers: [{ url: baseUrl, description: 'Current server' }],
});

export const openApiSpec = getOpenApiSpec('http://localhost:5000');
