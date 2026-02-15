# UCC — University Campus Connect

University Campus Connect is a data-driven social intelligence platform for students. This MVP combines:
- **LinkedIn-style profiles**
- **Slack-style real-time chat**
- **Intelligent matching and graph insights**

## Architecture

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Realtime**: Socket.io
- **Core Data**: PostgreSQL (with in-memory fallback for local MVP)
- **Graph Layer**: Neo4j (with in-memory fallback for local MVP)
- **Auth**: JWT
- **Deploy**: Vercel (frontend), Render/Railway (backend)

## Monorepo Structure

```
/backend
  /src
    /config
    /controllers
    /middleware
    /repositories
    /routes
    /services
    /sockets
    /scripts
  /tests
/frontend
  /src
```

## Features Implemented

### Authentication
- Register and login with JWT
- Auth middleware for protected routes

### Student Profile
- Name
- Department
- Academic strengths and weak subjects
- Skills and interests
- Weekly availability time blocks

### Social Graph (Neo4j)
- Student nodes
- Relationships:
  - `STUDIES_WITH`
  - `WORKED_ON_PROJECT`
  - `MENTORS`
  - `SAME_INTEREST`
- Graph updates on profile creation and chat interactions

### Matching Engine
Weighted score:
- 0.4 skill complement
- 0.3 schedule overlap
- 0.2 shared interests
- 0.1 graph proximity (shortest path)

Returns top 5 ranked matches.

### Real-time
- 1–1 / room-based chat
- Online status
- Live notifications

### Projects
- Create projects with required skills + max members
- Candidate suggestions based on:
  - Skill match
  - Degree centrality

### Graph Analytics
- Shortest path
- Degree centrality
- Common neighbors

### Dashboard Pages
- Login/Register
- Profile Setup
- Smart Match Suggestions
- Graph Insights
- Projects
- Real-time Chat

## Environment Variables

### Backend (`backend/.env`)

```
PORT=4000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_me
POSTGRES_URL=postgresql://user:pass@host:5432/db
NEO4J_URI=neo4j+s://xxxxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=secret
```

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:4000/api
```

## Local Setup

```bash
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

## Seed Sample Data

```bash
npm run seed -w backend
```

Creates sample students for MVP testing.

## Testing

```bash
npm test
```

Runs Vitest tests for matching algorithm.

## Production Build

```bash
npm run build
```

## Deployment

### Frontend to Vercel
1. Import repo into Vercel.
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Set env var `VITE_API_URL` to backend API URL.

### Backend to Render / Railway
1. Create a new web service from `backend` folder.
2. Build command: `npm install && npm run build`
3. Start command: `npm run start`
4. Set all backend env vars.
5. Provision managed PostgreSQL + Neo4j and wire env vars.

## Notes for Scaling
- Replace in-memory fallback stores with persistent DB-only mode in production.
- Add refresh tokens, RBAC, message persistence in PostgreSQL, and Neo4j GDS for advanced centrality.
- Add full E2E test coverage and observability.
