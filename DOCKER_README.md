# Docker Setup for GreenDrive Application

This document explains how to run the complete GreenDrive application (frontend + backend + database) using Docker.

## Prerequisites

- Docker and Docker Compose installed on your system
- Your backend application in a directory relative to this frontend (adjust the path in `docker-compose.yml` if needed)

## Quick Start

### 1. Build and Run All Services

```bash
docker compose up --build
```

This will start:

- **Frontend** (React + Vite): http://localhost:3000
- **Backend** (Spring Boot): http://localhost:8080
- **Database** (MySQL): localhost:3306

### 2. Run in Background

```bash
docker compose up -d --build
```

### 3. Stop All Services

```bash
docker compose down
```

### 4. Stop and Remove Volumes (Clean Database)

```bash
docker compose down -v
```

## Service Details

### Frontend (React + Vite)

- **Container**: `greendrive-frontend`
- **Port**: 3000 (mapped to container port 80)
- **Technology**: React with Vite, served by Nginx
- **API Proxy**: All `/api/*` requests are automatically proxied to the backend

### Backend (Spring Boot)

- **Container**: `greendrive-backend`
- **Port**: 8080
- **Technology**: Spring Boot with JPA/Hibernate
- **Database**: Connects to MySQL container
- **Health Check**: Available at `/actuator/health`

### Database (MySQL)

- **Container**: `greendrive-mysql`
- **Port**: 3306
- **Database**: `greendrive_db`
- **Username**: `root` / `greendrive_user`
- **Password**: `12345678` / `greendrive_pass`
- **Data Persistence**: Volume `mysql_data`

## Development Workflow

### Frontend Development Only

If you want to run only the frontend for development:

```bash
# Run backend and database
docker compose up mysql backend -d

# Run frontend in development mode (with hot reload)
npm run dev
```

### Backend Development Only

If you want to develop the backend while running containerized database:

```bash
# Run only the database
docker compose up mysql -d

# Run your backend locally (it will connect to the containerized MySQL)
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f mysql
```

### Database Management

#### Connect to MySQL

```bash
docker compose exec mysql mysql -u root -p greendrive_db
# Password: 12345678
```

#### Backup Database

```bash
docker compose exec mysql mysqldump -u root -p greendrive_db > backup.sql
```

#### Restore Database

```bash
docker compose exec -T mysql mysql -u root -p greendrive_db < backup.sql
```

## Configuration

### Environment Variables

You can override environment variables by creating a `.env` file:

```env
# Database
MYSQL_ROOT_PASSWORD=your_password
MYSQL_DATABASE=your_database
MYSQL_USER=your_user
MYSQL_PASSWORD=your_user_password

# Backend
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=3600000

# Ports
FRONTEND_PORT=3000
BACKEND_PORT=8080
MYSQL_PORT=3306
```

### Backend Directory

Update the backend build context in `docker-compose.yml`:

```yaml
backend:
  build: ../your-backend-directory # Adjust this path
```

### Database Initialization

If you have SQL initialization scripts, place them in a `mysql/init/` directory and uncomment the volume mapping in `docker-compose.yml`:

```yaml
volumes:
  - ./mysql/init:/docker-entrypoint-initdb.d
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Check what's using the port
   lsof -i :3000  # or :8080, :3306

   # Change ports in docker-compose.yml if needed
   ```

2. **Database Connection Issues**

   ```bash
   # Check if MySQL is healthy
   docker compose ps

   # View MySQL logs
   docker compose logs mysql
   ```

3. **Frontend Can't Reach Backend**

   - Ensure both services are on the same network
   - Check the nginx proxy configuration in `nginx.conf`
   - Verify the backend container name matches in nginx config

4. **Permission Issues**
   ```bash
   # Fix file permissions
   sudo chown -R $USER:$USER .
   ```

### Reset Everything

```bash
# Stop all containers and remove volumes
docker compose down -v

# Remove all images
docker compose down --rmi all

# Rebuild everything
docker compose up --build
```

## Production Considerations

For production deployment:

1. **Environment Variables**: Use proper secrets management
2. **Database**: Use external managed database service
3. **SSL/HTTPS**: Add SSL termination
4. **Monitoring**: Add health checks and monitoring
5. **Scaling**: Use orchestration tools like Kubernetes

## Network Architecture

```
Internet
    ↓
Frontend (Nginx) :3000
    ↓ (proxy /api/*)
Backend (Spring Boot) :8080
    ↓ (JDBC)
MySQL Database :3306
```

All services communicate through the `greendrive-network` Docker network for security and isolation.
