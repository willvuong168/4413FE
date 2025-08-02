# GreenDrive - Electric Vehicle Online Store

## Prerequisites

- Node.js (>= 14.x) and npm (for local development)
- Docker and Docker Compose (for containerized development/deployment)
- IMPORTANT: make sure browser is not in dark mode, some components may not be able to be seen.

## Quick Start

### Option 1: Docker (Recommended)

#### Development with Docker:

```bash
git clone https://github.com/willvuong168/4413FE.git
cd 4413FE

# Run in development mode with hot reload
docker compose --profile dev up --build

# Access the app at http://localhost:5173
```

#### Production with Docker:

```bash
# Build and run production version
docker compose --profile prod up --build

# Access the app at http://localhost:3000
```

#### Development with API Proxy:

```bash
# Run with nginx proxy for API routing
docker compose --profile dev-proxy up --build

# Access the app at http://localhost:8080
```

### Option 2: Local Development

#### Check your versions:

```bash
node -v
npm -v
```

#### Clone the repository and install dependencies:

```bash
git clone https://github.com/willvuong168/4413FE.git
cd 4413FE
npm install
```

#### Run the React app:

```bash
npm run dev
```

## Login Details

Admin Credentials:
Username: admin1
Password: password1

Customer Credentials:
We have users 2 to 10. Access customer accounts using the following credentials:

```
Username: user<#>        eg. user7
Password: password<#>    eg. password7
```
