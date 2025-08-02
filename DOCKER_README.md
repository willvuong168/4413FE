# Docker Setup for 4413FE React Application

This project has been dockerized for both development and production environments.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

### Development Mode

To run the application in development mode with hot reloading:

```bash
docker compose --profile dev up --build
```

This will:

- Build the development image
- Start the development server on port 5173
- Enable hot reloading for code changes
- Mount the source code as a volume for live updates

Access the application at: http://localhost:5173

### Production Mode

To run the application in production mode:

```bash
docker compose --profile prod up --build
```

This will:

- Build the production image with nginx
- Serve the optimized build on port 80
- Use nginx for better performance and security

Access the application at: http://localhost

### Production Mode (Custom Port)

To run production mode on a custom port (e.g., 3000):

```bash
docker compose --profile prod-custom up --build
```

Access the application at: http://localhost:3000

## Docker Commands

### Build the image manually

```bash
# Build development image
docker build --target builder -t 4413fe-dev .

# Build production image
docker build --target runner -t 4413fe-prod .
```

### Run containers manually

```bash
# Development
docker run -p 5173:5173 -v $(pwd):/app 4413fe-dev npm run dev -- --host 0.0.0.0

# Production
docker run -p 80:80 4413fe-prod
```

### Stop containers

```bash
# Stop all containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

## Dockerfile Structure

The Dockerfile uses a multi-stage build approach:

1. **Base Stage**: Uses Node.js 18 Alpine as the base image
2. **Dependencies Stage**: Installs production dependencies
3. **Builder Stage**: Builds the React application
4. **Runner Stage**: Uses nginx to serve the built application

## Nginx Configuration

The `nginx.conf` file includes:

- Client-side routing support (SPA routing)
- Gzip compression
- Static asset caching
- Security headers
- Proper MIME types

## Environment Variables

The application supports the following environment variables:

- `NODE_ENV`: Set to 'development' or 'production'

## Troubleshooting

### Port already in use

If you get a port conflict, you can:

1. Stop other services using the same port
2. Use the custom port profile: `docker compose --profile prod-custom up`
3. Modify the port mapping in `docker-compose.yml`

### Build issues

If you encounter build issues:

1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker compose build --no-cache`

### Development hot reload not working

Ensure you're using the development profile and the volumes are properly mounted.

## Production Deployment

For production deployment, consider:

1. Using a reverse proxy (like Traefik or nginx)
2. Setting up SSL/TLS certificates
3. Configuring environment-specific variables
4. Setting up monitoring and logging
5. Using Docker Swarm or Kubernetes for orchestration

## API Proxy Configuration

The application is configured to proxy API requests to `https://kong-4ba1e74424uslyzd1.kongcloud.dev`. This configuration is handled by Vite's proxy settings in `vite.config.js` and will work in development mode. For production, you may need to configure nginx to handle API proxying or update the API endpoints to use absolute URLs.
