# Docker Setup for GreenDrive Frontend

This document provides detailed information about the Docker configuration for the GreenDrive React application.

## Docker Architecture

The project uses a multi-stage Dockerfile with three targets:

1. **Development**: For local development with hot reload
2. **Build**: Intermediate stage for building the application
3. **Production**: Optimized production build served with Nginx

## Files Overview

### Dockerfile

- Multi-stage build configuration
- Development stage with Node.js and Vite dev server
- Production stage with Nginx serving static files
- Optimized for both development and production use

### docker-compose.yml

Uses Docker Compose profiles for different environments:

- `dev`: Development mode with hot reload (port 5173)
- `prod`: Production mode with Nginx (port 3000)
- `dev-proxy`: Development with Nginx proxy for API routing (port 8080)

### nginx.conf

Production Nginx configuration featuring:

- SPA routing support (`try_files` directive)
- API proxy to `https://4413groupa.me`
- Gzip compression
- Security headers
- Static asset caching

### nginx-dev.conf

Development Nginx proxy configuration:

- Proxies frontend requests to Vite dev server
- Handles WebSocket connections for Hot Module Replacement (HMR)
- Proxies API requests to external backend

### .dockerignore

Excludes unnecessary files from Docker build context:

- Node modules and build artifacts
- Git and IDE files
- Environment files
- Docker configuration files

## Usage

### Development Mode

```bash
# Start development server with hot reload
docker compose --profile dev up --build

# Run in detached mode
docker compose --profile dev up -d --build

# Stop services
docker compose --profile dev down
```

### Production Mode

```bash
# Build and start production server
docker compose --profile prod up --build

# Run in detached mode
docker compose --profile prod up -d --build

# Stop services
docker compose --profile prod down
```

### Development with API Proxy

```bash
# Start development with Nginx proxy
docker compose --profile dev-proxy up --build

# This setup provides a single entry point for both frontend and API calls
```

## Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to 'development' or 'production'
- `VITE_API_URL`: Backend API URL (defaults to https://4413groupa.me)

## Port Configuration

- **Development**: 5173 (Vite dev server)
- **Production**: 3000 (Nginx)
- **Dev Proxy**: 8080 (Nginx proxy)

## API Proxy Configuration

The application is configured to proxy `/api/*` requests to the backend server at `https://4413groupa.me`. This is handled differently in each mode:

- **Development**: Vite's built-in proxy (vite.config.js)
- **Production**: Nginx proxy_pass directive
- **Dev Proxy**: Nginx proxy for both frontend and API

## Build Optimization

The production build includes:

- Multi-stage Docker build for smaller image size
- Gzip compression for static assets
- Long-term caching headers for static files
- Security headers for enhanced protection

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5173, 3000, and 8080 are not in use
2. **API connectivity**: Verify the backend at https://4413groupa.me is accessible
3. **Hot reload not working**: Make sure you're using the `dev` profile and the volume mounts are correct

### Useful Commands

```bash
# View logs
docker compose --profile dev logs -f

# Rebuild without cache
docker compose --profile dev build --no-cache

# Remove all containers and volumes
docker compose --profile dev down -v

# Access container shell
docker compose --profile dev exec app-dev sh
```

## Performance Considerations

- The production image uses Alpine Linux for minimal size
- Static assets are served directly by Nginx with appropriate caching headers
- Gzip compression is enabled for better transfer speeds
- Development mode includes volume mounting for instant file changes
