# Multi-stage Dockerfile for Angular Frontend

# STAGE 1: Build Angular dist
FROM node:22-alpine AS build
WORKDIR /app

# Copy package descriptors and install dependencies (lockfile is authoritative)
COPY package*.json ./
RUN npm ci

# Copy source code and build production output
COPY . .
RUN npm run build

# STAGE 2: Serve static files with Nginx
FROM nginx:alpine

# Default port; Render overrides this via the PORT env var at runtime
ENV PORT=80

COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Official nginx image auto-runs envsubst on /etc/nginx/templates/*.template,
# substituting ${PORT} from the environment
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
