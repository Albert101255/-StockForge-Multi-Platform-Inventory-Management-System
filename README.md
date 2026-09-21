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
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend at the URL printed by Vite.

## Security

Seeded accounts are for local demonstration only. Do not reuse seeded passwords in an internet-facing deployment. Production deployments should use generated secrets and proper environment-variable management.

## Project status

This is a portfolio/learning project. Features described as future work should not be treated as completed until they are present in the repository and tested.

## Next improvements

- Add screenshots/demo GIF
- Add automated tests
- Add CI
- Add a deployable demo
- Add API documentation generated from the implementation
- Rename the repository from `-StockForge-Multi-Platform-Inventory-Management-System` to `stockforge`
