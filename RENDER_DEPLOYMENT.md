# 🚀 Deployment Guide for Render (Render.com)

This project is fully configured for deployment on [Render](https://render.com) using Docker containers and a Render Blueprint.

---

## 🛠️ Included Deployment Files

1. **`render.yaml`**: Blueprint configuration for the Backend and Frontend web services.
2. **`backend/Dockerfile`**: Multi-stage Docker image (Maven build → Java 21 JRE runtime).
3. **`frontend/Dockerfile`**: Multi-stage Docker image (Angular build → Nginx).
4. **`frontend/nginx.conf.template`**: Nginx config that binds to `$PORT` (Render injects this) with SPA routing.
5. **`frontend/.dockerignore`**: Keeps local `node_modules`/`dist` out of the Docker build context.

---

## ⚡ Option 1: Automatic Blueprint Deployment (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Configure project for Render deployment"
   git push origin main
   ```

2. **Deploy on Render**:
   - Log in to your [Render Dashboard](https://dashboard.render.com).
   - Click **New +** → **Blueprint**.
   - Connect your GitHub repository (`Secure-File-Verification-Platform`).
   - Render will detect `render.yaml` and create:
     - ☕ **Backend Web Service** (`secure-file-verification-backend`)
     - 🅰️ **Frontend Web Service** (`secure-file-verification-frontend`)
   - Click **Apply**. Render builds and launches both services automatically.

---

## 🗄️ Database

Out of the box, the backend falls back to an **in-memory H2 database**, so it always starts — even on the free plan with no database attached. Data resets on every redeploy/restart.

To persist data:
1. Create a PostgreSQL instance: Dashboard → **New +** → **Postgres**.
2. In the backend service → **Environment**, set:
   - `SPRING_DATASOURCE_URL` = the **Internal Database URL**
   - `SPRING_DATASOURCE_USERNAME` = from the database info page
   - `SPRING_DATASOURCE_PASSWORD` = from the database info page

Hibernate `ddl-auto=update` creates the table automatically.

> Note: files are hashed and only metadata is stored, so nothing large lives in the database.

---

## 🔧 Option 2: Manual Web Service Deployment

### Backend
1. Dashboard → **New +** → **Web Service** → connect repo.
2. Root Directory: `backend`, Runtime: **Docker**, Region: Singapore.
3. Environment variables (all optional):
   - `PORT` = `8080` (defaults correctly if unset)
   - `SPRING_DATASOURCE_URL` / `USERNAME` / `PASSWORD` (see Database section)

### Frontend
1. Dashboard → **New +** → **Web Service** → connect repo.
2. Root Directory: `frontend`, Runtime: **Docker**, Region: Singapore.
3. No environment variables needed — Nginx binds to Render's injected `PORT`.

---

## ✅ Verification
Once deployed (free instances sleep after 15 min of inactivity; first request may take ~50s to wake):
- **Backend Health Check**: `https://<backend-url>.onrender.com/` → `"Backend is running successfully!"`
- **Frontend App**: `https://<frontend-url>.onrender.com` — status pill should show `CONNECTED`.

The frontend auto-targets `https://secure-file-verification-backend.onrender.com` in production; you can override the API URL in the UI settings field at any time.
