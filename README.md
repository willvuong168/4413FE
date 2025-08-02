# GreenDrive - Electric Vehicle Online Store

## Prerequisites

- Node.js (>= 14.x) and npm (for local development)
- Docker and Docker Compose (for containerized deployment)
- IMPORTANT: make sure browser is not in dark mode, some components may not be able to be seen.

## Check your versions of these by running:

```
node -v
npm -v
docker --version
docker compose version
```

## Quick Start with Docker (Recommended)

### Development Mode

```bash
# Start development server with hot reload
docker compose --profile dev up

# Access the app at http://localhost:5173
```

### Production Mode

```bash
# Build and start production server
docker compose --profile prod up

# Access the app at http://localhost:8888
```

### Production Mode (Custom Port)

```bash
# Start production server on port 3000
docker compose --profile prod-custom up

# Access the app at http://localhost:3000
```

## Local Development (Alternative)

### Clone the repository and install dependencies:

```bash
git clone https://github.com/willvuong168/4413FE.git
cd 4413FE
npm install
```

### Run the React app:

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
