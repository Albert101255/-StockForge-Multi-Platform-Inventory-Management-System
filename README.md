> **Live Interactive Web Application:** [https://albert101255.github.io/-StockForge-Multi-Platform-Inventory-Management-System/](https://albert101255.github.io/-StockForge-Multi-Platform-Inventory-Management-System/)

# StockForge — Inventory Management System

A full-stack inventory management application built with React, Express and Prisma. It focuses on everyday stock operations, role-based access, audit history and dashboard reporting.

> Repository rename recommended: `stockforge`

## Features implemented in the repository

- Inventory item management
- Category management
- Stock quantity tracking
- Low-stock indicators
- Authentication and role separation
- Soft deletion / restore workflow
- Stock movement history
- Dashboard views and charts
- React frontend + Express backend
- Prisma-based database access

## Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express
- Prisma
- JWT authentication
- bcrypt

### Database
- PostgreSQL / SQLite depending on configuration

## Project structure

```text
StockForge/
├── client/          # React frontend
└── server/          # Express API + Prisma
```

The frontend contains dashboard, inventory, category, trash and authentication views. The backend is separated into routes, controllers, middleware and Prisma data access.

## Run locally

### Backend

```bash
cd server
npm install
npm run db:push
npm run db:seed
npm test
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend at the URL printed by Vite.

### Docker Compose

```bash
cp .env.example .env
docker compose up --build
```

## Security

Seeded accounts are for local demonstration only. Do not reuse seeded passwords in an internet-facing deployment. Production deployments require `JWT_SECRET` to be configured via environment variables.

## License

MIT License — see [LICENSE](LICENSE).
