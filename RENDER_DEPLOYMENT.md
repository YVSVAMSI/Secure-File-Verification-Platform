# 🚀 Deployment Guide for Render (Render.com)

This project is fully configured for seamless, one-click deployment on [Render](https://render.com) using Docker containers and Render Blueprints.

---

## 🛠️ Included Deployment Files

1. **[`render.yaml`](file:///Users/bunnyyvs/Desktop/PROJECTS/Secure-File-Verification-Platform/render.yaml)**: Blueprint configuration orchestrating the Backend, Frontend, and Database.
2. **[`backend/Dockerfile`](file:///Users/bunnyyvs/Desktop/PROJECTS/Secure-File-Verification-Platform/backend/Dockerfile)**: Multi-stage Docker image for Java 21 Spring Boot.
3. **[`frontend/Dockerfile`](file:///Users/bunnyyvs/Desktop/PROJECTS/Secure-File-Verification-Platform/frontend/Dockerfile)**: Multi-stage Docker image for Angular served via Nginx.
4. **[`frontend/nginx.conf`](file:///Users/bunnyyvs/Desktop/PROJECTS/Secure-File-Verification-Platform/frontend/nginx.conf)**: Nginx routing configuration for single-page applications (SPA).

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
   - Click **New +** at the top right and select **Blueprint**.
   - Connect your GitHub repository (`Secure-File-Verification-Platform`).
   - Render will automatically detect `render.yaml` and create:
     - 🗄️ **PostgreSQL Database** (`secure-file-db`)
     - ☕ **Backend Web Service** (`secure-file-verification-backend`)
     - 🅰️ **Frontend Web Service** (`secure-file-verification-frontend`)
   - Click **Apply**. Render will build and launch all services automatically!

---

## 🔧 Option 2: Manual Web Service Deployment

If you prefer deploying services individually:

### Step 1: Create Database
1. Go to Render Dashboard -> **New +** -> **PostgreSQL**.
2. Name: `secure-file-db`, Database: `file_integrity_db`.
3. Copy the **Internal Database URL** once created.

### Step 2: Deploy Backend Web Service
1. Render Dashboard -> **New +** -> **Web Service**.
2. Connect your GitHub repo.
3. Root Directory: `backend`
4. Runtime: **Docker**
5. Environment Variables:
   - `SPRING_DATASOURCE_URL` = *(Internal Database URL from Step 1)*
   - `SPRING_JPA_HIBERNATE_DDL_AUTO` = `update`
   - `PORT` = `8080`

### Step 3: Deploy Frontend Web Service
1. Render Dashboard -> **New +** -> **Web Service** (or Static Site).
2. Root Directory: `frontend`
3. Runtime: **Docker**

---

## ✅ Verification
Once deployed:
- **Backend Health Check**: `https://<your-backend-name>.onrender.com/` (should return `"Backend is running successfully!"`).
- **Frontend App**: `https://<your-frontend-name>.onrender.com`
