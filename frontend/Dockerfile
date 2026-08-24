# Multi-stage Dockerfile for Angular Frontend

# STAGE 1: Build Angular dist
FROM node:22-alpine AS build
WORKDIR /app

# Copy package descriptors and install dependencies
COPY package*.json ./
RUN npm ci || npm install

# Copy source code and build production output
COPY . .
RUN npm run build

# STAGE 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
