# Notes API — Backend

Production-grade REST API for the Notes application with JWT authentication, full-text search, sharing permissions, version history, and OpenAPI documentation.

## Tech Stack

- Node.js, Express.js
- MongoDB Atlas, Mongoose ODM
- JWT, bcryptjs, Joi validation
- Winston, Morgan, Helmet, CORS, Rate Limiting
- Swagger UI, Jest, Supertest

## Quick Start

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI and JWT_SECRET (min 32 chars)
npm install
npm run dev
```

API: `http://localhost:5000`  
Swagger UI: `http://localhost:5000/api-docs`  
OpenAPI JSON: `http://localhost:5000/openapi.json`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `development` \| `production` \| `test` |
| `PORT` | Server port (default: 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key (min 32 characters) |
| `JWT_EXPIRES_IN` | Token expiry (default: 7d) |
| `CORS_ORIGIN` | Frontend URL (default: http://localhost:5173) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (default: 900000) |
| `RATE_LIMIT_MAX` | Max requests per window (default: 100) |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/about` | API information |
| GET | `/openapi.json` | OpenAPI specification |
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login user |
| GET | `/api/v1/notes` | List notes (paginated) |
| GET | `/api/v1/notes/shared` | Shared notes |
| GET | `/api/v1/notes/:id` | Get note |
| POST | `/api/v1/notes` | Create note |
| PUT | `/api/v1/notes/:id` | Update note |
| DELETE | `/api/v1/notes/:id` | Delete note |
| POST | `/api/v1/notes/:id/share` | Share note |
| GET | `/api/v1/notes/:id/history` | Version history |
| POST | `/api/v1/notes/:id/restore/:versionId` | Restore version |
| GET | `/api/v1/search?q=` | Full-text search |

## Testing

```bash
npm test
```

## Docker

```bash
docker build -t notes-api .
docker run -p 5000:5000 --env-file .env notes-api
```

## Deployment (Render / Railway)

1. Connect repository and set root to `backend`
2. Build: `npm install`
3. Start: `npm start`
4. Set environment variables from `.env.example`
5. Use MongoDB Atlas for `MONGODB_URI`

## Architecture

```
src/
├── config/         # Environment validation
├── controllers/    # HTTP request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── models/         # Mongoose schemas
├── routes/         # API routes
├── middlewares/    # Auth, validation, rate limit
├── validators/     # Joi schemas
├── utils/          # Helpers, logger, errors
├── docs/           # OpenAPI spec
└── tests/          # Unit & integration tests
```
