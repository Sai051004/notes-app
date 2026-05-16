# Notes App — Frontend

Modern React application for the Notes platform.

## Quick Start

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL (default: `/api/v1` via proxy) |

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run preview` — Preview production build

## Deployment (Vercel / Netlify)

1. Set root directory to `frontend`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment: `VITE_API_URL=https://your-api.com/api/v1`

## Docker

```bash
docker build -t notes-frontend .
docker run -p 5173:80 notes-frontend
```
