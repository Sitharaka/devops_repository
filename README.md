# Dockerized DevOps Project

## Quick Start

1. Build and run all services:

```bash
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure
- `frontend/` — React app, served by Nginx
- `backend/` — Node.js/Express API
- `docker-compose.yaml` — Orchestrates both services

## Stopping

```bash
docker-compose down
```

---

For development, you can mount volumes and use hot-reload as needed.
