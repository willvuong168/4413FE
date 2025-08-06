# 🚗 GreenDrive – Electric Vehicle Online Store

A modern web application for browsing and purchasing electric vehicles, built with React and Vite, and containerized using Docker.

---

## 📦 Prerequisites

- **Node.js** >= 14.x and **npm** – for local development
- **Docker** and **Docker Compose** – for containerized development or deployment

> ⚠️ **Note**: If you're running the backend locally, update all frontend API URLs from  
`https://4413groupa.me` → `http://localhost:8080`.

---

## 🚀 Quick Start

### ✅ Option 1: Docker (Recommended)

#### 🛠 Development Mode (with hot reload)

```bash
git clone https://github.com/willvuong168/4413FE.git
cd 4413FE

docker compose --profile dev up --build
```

Access the app: [http://localhost:5173](http://localhost:5173)

---

#### ⚙️ Production Mode

```bash
docker compose --profile prod up --build
```

Access the app: [http://localhost:3000](http://localhost:3000)

---

#### 🌐 Development with API Proxy (Nginx)

```bash
docker compose --profile dev --profile dev-proxy up --build
```

Access the app: [http://localhost:8080](http://localhost:8080)

---

### 💻 Option 2: Local Development (No Docker)

#### 1. Check your environment:

```bash
node -v
npm -v
```

#### 2. Clone and install dependencies:

```bash
git clone https://github.com/willvuong168/4413FE.git
cd 4413FE
npm install
```

#### 3. Start the development server:

```bash
npm run dev
```

Access the app at [http://localhost:5173](http://localhost:5173)

---

## 🔐 Login Credentials

### 👨‍💼 Admin Account
```
Username: admin1
Password: password1
```

### 👥 Customer Accounts (user2 to user10)
```
Username: user<#>        e.g. user7
Password: password<#>    e.g. password7
```

---
