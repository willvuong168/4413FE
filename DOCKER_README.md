# Docker Setup for 4413FE React Application

This project has been dockerized with support for both development and production environments.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Mode

To run the application in development mode with hot reloading:

```bash
docker compose --profile dev up --build
```

The application will be available at `http://localhost:5173`

### Production Mode

To run the application in production mode:

```bash
docker compose --profile prod up --build
```

The application will be available at `http://localhost:80`

### Production Mode (Custom Port)

To run the application in production mode on port 3000:

```bash
docker compose --profile prod-custom up --build
```

The application will be available at `http://localhost:3000`

## Docker Commands

### Build Images

```bash
# Build development image
docker build -f Dockerfile.dev -t 4413fe-dev .

# Build production image
docker build -f Dockerfile -t 4413fe-prod .
```

### Run Containers

```bash
# Run development container
docker run -p 5173:5173 -v $(pwd):/app 4413fe-dev

# Run production container
docker run -p 80:80 4413fe-prod
```

### Stop Services

```bash
# Stop all services
docker compose down

# Stop and remove volumes
docker compose down -v
```

## File Structure

- `Dockerfile` - Multi-stage production build
- `Dockerfile.dev` - Development build with hot reloading
- `docker-compose.yml` - Orchestration for different environments
- `nginx.conf` - Nginx configuration for production serving
- `.dockerignore` - Files to exclude from Docker build context

## Features

### Development Environment

- Hot reloading enabled
- Volume mounting for live code changes
- Vite dev server with host binding
- All development dependencies included

### Production Environment

- Multi-stage build for optimized image size
- Nginx server for static file serving
- Gzip compression enabled
- Security headers configured
- Client-side routing support
- Static asset caching

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV` - Set to 'development' or 'production'

## Troubleshooting

### Port Already in Use

If port 80 or 5173 is already in use, you can modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:80" # Use port 8080 instead of 80
```

### Build Issues

If you encounter build issues, try:

```bash
# Clean up Docker cache
docker system prune -a

# Rebuild without cache
docker compose --profile prod up --build --no-cache
```

### Permission Issues

On Linux/macOS, you might need to run Docker commands with sudo or add your user to the docker group.

## API Proxy Configuration

The application is configured to proxy API requests to `https://4413groupa.me:8081`. This configuration is in `vite.config.js` and will work in both development and production environments.

## Security Notes

- The production build includes security headers
- Content Security Policy is configured
- XSS protection is enabled
- Frame options are set to prevent clickjacking
