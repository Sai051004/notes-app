# Notes Application

A full-stack, multi-user notes service — similar in spirit to Google Keep or Apple Notes. Users can register, sign in, manage personal notes, share notes with other users, search content, and (via the web UI) browse version history.

The backend exposes **assignment-compatible REST routes** at the server root (`/register`, `/login`, `/notes`, …) for automated evaluation. A React frontend is included to use the API interactively.

---

## What Is Implemented

### Required (assignment) APIs

| # | Feature | Endpoint | Notes |
|---|---------|----------|--------|
| 1 | Register | `POST /register` | `201` + `{ "message": "..." }` |
| 2 | Login | `POST /login` | `200` + `{ "access_token": "..." }`; `401` + `{ "message": "Invalid email or password" }` |
| 3 | List notes | `GET /notes` | JWT required; returns owned notes as JSON array |
| 4 | Get note | `GET /notes/{id}` | Owner or user the note was shared with |
| 5 | Create note | `POST /notes` | `201` + note with `id`, `title`, `content`, `created_at`, `updated_at` |
| 6 | Update note | `PUT /notes/{id}` | `200` + updated note |
| 7 | Delete note | `DELETE /notes/{id}` | `204 No Content` |
| 8 | Share note | `POST /notes/{id}/share` | Body: `{ "share_with_email": "..." }`; `200` + message |
| 9 | OpenAPI | `GET /openapi.json` | OpenAPI 3.0 document |
| 10 | About | `GET /about` | Author info + custom features object |

Note responses use **snake_case** fields (`id`, `created_at`, `updated_at`) as required by the spec.

### Custom feature (required by brief)

Documented on `GET /about` under `"my features"`:

- **Version History** — snapshot on each update; list and restore previous versions (UI + API).
- **Full-Text Search** — `GET /search?q=keyword` across title and content.
- **Secure Note Sharing** — share by email; recipients can read shared notes via `GET /notes/{id}`.

### Stretch goals & extras

- **Pagination** — optional `page` / `limit` on list and search flows (extended API).
- **Docker** — `docker-compose.yml` runs MongoDB, backend, and frontend.
- **Frontend** — React app with auth, dashboard, CRUD, share, search, history, dark mode.
- **Swagger UI** — `GET /api-docs` for interactive exploration.
- **Security** — Helmet, rate limiting, Joi validation, bcrypt, mongo sanitization, centralized errors.
- **Tests** — Jest integration tests for assignment endpoints (`npm test` in `backend`).

---

## Project Structure

```
notes-app/
├── backend/                 # Node.js + Express + MongoDB
│   ├── src/
│   │   ├── controllers/     # assignment.* + extended handlers
│   │   ├── services/        # business logic
│   │   ├── repositories/    # data access
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # assignment routes (root paths)
│   │   ├── middlewares/     # auth, validation, errors
│   │   ├── validators/      # Joi schemas
│   │   ├── docs/openapi.js  # OpenAPI spec
│   │   └── tests/           # Jest tests
│   ├── server.js
│   └── Dockerfile
├── frontend/                # React + Vite + Tailwind
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard, etc.
│   │   ├── components/
│   │   ├── services/        # API clients
│   │   └── context/         # Auth & theme
│   └── Dockerfile
├── docker-compose.yml
├── DEPLOYMENT.md            # Render / Railway / Vercel guide
└── README.md
```

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, React Hook Form, React Toastify |
| Backend | Node.js, Express, Mongoose, JWT, Joi, Winston, Swagger UI |
| Database | MongoDB (Atlas or local / Docker) |
| Testing | Jest, Supertest, mongodb-memory-server |
| DevOps | Docker, Docker Compose |

---

## Architecture

**Backend** — layered MVC with repositories:

`HTTP Routes → Controllers → Services → Repositories → Models`

Assignment controllers format responses for grading; services hold shared logic (access control, sharing, versioning).

**Frontend** — feature-oriented:

`Pages → Components → Services → Axios (Bearer JWT)`

---

## API Reference (assignment paths)

Base URL examples:

- Local: `http://localhost:5000`
- Deployed: `https://your-api.onrender.com` (no `/api/v1` prefix)

### Authentication

**Register**

```http
POST /register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Login**

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{ "access_token": "<jwt>" }
```

Use on protected routes:

```http
Authorization: Bearer <access_token>
```

### Notes

**List (owned notes)**

```http
GET /notes
Authorization: Bearer <token>
```

Response: array of notes.

**Get one**

```http
GET /notes/{id}
Authorization: Bearer <token>
```

**Create**

```http
POST /notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My note",
  "content": "Hello world"
}
```

**Update**

```http
PUT /notes/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "content": "Updated body"
}
```

**Delete**

```http
DELETE /notes/{id}
Authorization: Bearer <token>
```

→ `204` with empty body.

**Share**

```http
POST /notes/{id}/share
Authorization: Bearer <token>
Content-Type: application/json

{
  "share_with_email": "other@example.com"
}
```

The other user must already be registered. They can then open the note with `GET /notes/{id}`.

### Documentation & metadata

| Method | Path | Description |
|--------|------|-------------|
| GET | `/about` | Author name, email, custom features |
| GET | `/openapi.json` | Machine-readable API spec |
| GET | `/api-docs` | Swagger UI (browser) |
| GET | `/health` | Health check |

### Extended endpoints (frontend / stretch)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/search?q=` | Search notes by keyword |
| GET | `/notes/shared` | Notes shared with current user |
| GET | `/notes/{id}/history` | Version history |
| POST | `/notes/{id}/restore/{versionId}` | Restore a version |

---

## Quick Start (local)

### Prerequisites

- Node.js 18+
- MongoDB Atlas connection string **or** Docker for local MongoDB

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Optional (for `/about`):

```env
ABOUT_NAME=Your Name
ABOUT_EMAIL=you@example.com
```

```bash
npm install
npm run dev
```

API: http://localhost:5000  
Swagger: http://localhost:5000/api-docs

### 2. Frontend

```bash
cd frontend
cp .env.example .env
```

Set:

```env
VITE_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

App: http://localhost:5173

> **Important:** After pulling API changes, **restart the backend** (`npm start` or `npm run dev`). If login shows `Route not found: /login`, the old server process is usually still running.

> **Page refresh / 401 JSON on `/notes/...`:** The frontend must call the API at `http://localhost:5000` (see `VITE_API_URL`). Do not proxy `/notes` in Vite — that path is used by React Router.
>
> **Vercel `404: NOT_FOUND` on `/notes/.../history`:** Deploy with `frontend/vercel.json` (SPA rewrite to `index.html`). Without it, refresh on deep links fails even when logged in.

### 3. Docker (full stack)

From project root:

```bash
set JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
docker compose up --build
```

- Frontend: http://localhost:5173  
- Backend: http://localhost:5000  
- MongoDB: port `27017` (internal to compose)

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Min 32 characters |
| `PORT` | No | Default `5000` |
| `CORS_ORIGIN` | No | Frontend URL (default `http://localhost:5173`) |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `ABOUT_NAME` | No | Shown on `GET /about` |
| `ABOUT_EMAIL` | No | Shown on `GET /about` |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL, e.g. `http://localhost:5000` (no trailing path) |

---

## Testing

```bash
cd backend
npm test
```

Covers registration, login, CRUD, share, about, OpenAPI, and search against an in-memory MongoDB.

---

## Security

- Passwords hashed with **bcrypt** (12 rounds)
- **JWT** for stateless auth on protected routes
- **Joi** request validation
- **Helmet** security headers
- **express-mongo-sanitize** against NoSQL injection
- **Rate limiting** on API and auth routes (disabled in `NODE_ENV=test`)
- Operational errors return JSON `{ "message": "..." }` without stack traces in production

---
