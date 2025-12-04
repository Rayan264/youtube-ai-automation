# YouTube AI Automation — Minimal Demo (GitHub-ready)

This repository contains a minimal, working example of a full-stack YouTube AI Automation system:
- Backend (Express) with JWT auth (stores data in `backend/db.json` for demo)
- Worker (Node) that polls backend for jobs and simulates video generation
- Frontend (Next.js 14 App Router) with Signup / Login / Dashboard

This is designed so you can upload directly to GitHub and deploy to Railway (or run locally).

## Quick Local Run

### Backend
```bash
cd backend
npm install
node server.js
```

### Worker
```bash
cd worker
npm install
node server.js
```

### Frontend
```bash
cd frontend
npm install
npx next dev
# open http://localhost:3000
```

## Deploying to Railway
1. Push this repository to GitHub.
2. Create a new Railway project → Deploy from GitHub.
3. Add two services:
   - Backend: set service to Web, start command `node server.js`
   - Worker: set service to Worker, start command `node server.js`
4. Add PostgreSQL later if you want; for demo the backend uses `backend/db.json`.

## Notes
- This is a minimal demo for early testing. Replace `backend/db.json` with PostgreSQL for production.
- The worker currently simulates video generation and sets a dummy result URL.

