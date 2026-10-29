# Task Manager DevOps Project

A local-first portfolio project using React + Vite, Node.js + Express, MongoDB, Docker Compose, GitHub Actions, and Kubernetes manifests for a local Kind cluster.

## Requirements
Install these separately if missing:
- Node.js LTS (includes npm)
- Git
- Docker Desktop (with Linux containers enabled)
- Visual Studio Code
- Optional for Kubernetes phase: kubectl, Kind, Helm

No AWS account or paid cloud is required.

## Quick start (recommended: Docker Compose)
1. Open this folder in VS Code.
2. Start Docker Desktop and wait until it says Docker is running.
3. In the VS Code terminal, run:
   ```powershell
   docker compose up --build
   ```
4. Open:
   - Frontend: http://localhost:5173
   - API health: http://localhost:5000/health
   - API tasks: http://localhost:5000/api/tasks

Stop:
```powershell
docker compose down
```

Stop and delete the local MongoDB data volume (this permanently deletes stored tasks):
```powershell
docker compose down -v
```

## Run without Docker (optional)
You still need a MongoDB server. Easiest is Docker Compose. If running services separately:
```powershell
cd backend
npm install
npm run dev
```
In another terminal:
```powershell
cd frontend
npm install
npm run dev
```
The Vite development server proxies `/api` to `http://localhost:5000`.

## Project structure
- `frontend/`: React UI and Vite config
- `backend/`: Express REST API, MongoDB model, API tests
- `docker-compose.yml`: local app + database
- `k8s/`: Kubernetes manifests for a local cluster
- `.github/workflows/ci.yml`: GitHub Actions checks

## API endpoints
- `GET /health` — health check
- `GET /api/tasks` — list tasks
- `POST /api/tasks` — create `{ "title": "Learn Kubernetes" }`
- `PATCH /api/tasks/:id` — update `{ "completed": true }`
- `DELETE /api/tasks/:id` — delete a task

## GitHub portfolio workflow
1. Create an empty repository on GitHub.
2. From this folder:
   ```powershell
   git init
   git add .
   git commit -m "Initial Task Manager DevOps project"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/task-manager-devops.git
   git push -u origin main
   ```
3. GitHub Actions runs the checks when you push.

## Kubernetes / Kind (later phase)
The manifests are included in `k8s/`, but first make sure Docker Compose works. Kubernetes manifests use local image names and are intended for a local Kind cluster. See `k8s/README.md` before deploying.
