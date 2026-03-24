# 🗃️ StockForge — Multi-Platform Inventory Management System

<div align="center">

![StockForge](https://img.shields.io/badge/StockForge-Inventory%20Management-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)

**A modern, full-stack inventory management system with an industrial dark dashboard aesthetic**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Contributing](#-contributing) • [License](#-license)

</div>

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Quick Start](#-quick-start)
- [Local Setup Instructions](#-local-setup-instructions)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Architecture & Patterns](#-architecture--patterns)
- [Design System](#-design-system)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)

---

## Overview

**StockForge** is a comprehensive inventory management solution designed for retail businesses, game stores, and merchandise operations. It provides a robust, elegant interface for managing stock levels, tracking inventory changes, categorizing products, and analyzing business metrics with detailed analytics and real-time stock tracking.

**Key Use Cases:**
- Video game store inventory management
- Console & accessory tracking
- Merchandise stock management
- Multi-location inventory synchronization
- Real-time stock alerts for low inventory items
- Historical audit trails for compliance

---

## ✨ Features

### 🎯 Core Functionality
- **Inventory Dashboard**: Real-time overview of stock levels, value metrics, and system health
- **Item Management**: Create, read, update, and soft-delete items with SKU tracking
- **Category Organization**: Manage product categories with custom icons
- **Stock Tracking**: Automatic stock level monitoring with low-stock alerts
- **Inventory History**: Immutable audit trail of all stock movements for compliance
- **Role-Based Access**: Separate admin and staff workflows with granular permissions

### 📊 Analytics & Reporting
- **Stock Value Charts**: Visualize total inventory value over time
- **Distribution Analysis**: Category-wise stock distribution gauges
- **Low Stock Alerts**: Configurable low-stock thresholds with visual indicators
- **Rich Dashboards**: Professional dark-theme UI with actionable metrics
- **Data Export**: Comprehensive inventory reports (detailed documentation included)

### 👥 User Management
- **Authentication**: JWT-based stateless authentication with bcrypt password hashing
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Full system access including category management and permanent deletions
  - **Staff**: Limited access for daily operations, cannot delete categories
- **User Profiles**: Track who created items and made changes
- **Session Security**: Secure token management with automatic expiration

### 🗑️ Data Integrity & Safety
- **Soft Deletions**: Items marked as deleted but recoverable, move to trash
- **Immutable Audit Trail**: `StockLog` records preserve complete history for compliance
- **Transaction Logging**: Every stock movement recorded with timestamp and reason
- **Data Recovery**: Trash/Recycle bin for restoring accidentally deleted items

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Why |
|---|---|---|---|
| **Frontend Framework** | React | 19.2.4 | Modern component library with hooks-based architecture |
| **Build Tool** | Vite | Latest | Lightning-fast HMR dev server and optimal production bundling |
| **Styling** | Tailwind CSS | v3 | Utility-first framework with custom design tokens |
| **UI Components** | Lucide React | 1.0.1 | Beautiful, consistent icon library |
| **Charts & Analytics** | Recharts | 3.8.0 | React-native SVG charting for business intelligence |
| **HTTP Client** | Axios | 1.13.6 | Promise-based HTTP client with interceptors |
| **Routing** | React Router | 7.13.2 | Client-side navigation without page reloads |
| **Backend Framework** | Express.js | 5.2.1 | Lightweight, reliable REST API foundation |
| **Runtime** | Node.js | 18+ | JavaScript runtime for server applications |
| **Database** | PostgreSQL/SQLite | 16 | Relational DBMS with data integrity |
| **ORM** | Prisma | 5.22.0 | Type-safe database access and migrations |
| **Authentication** | JWT + bcrypt | 9.0.3 / 6.0.0 | Industry-standard auth security |
| **Middleware** | CORS, dotenv | - | Request handling and environment management |
| **Dev Tools** | Nodemon, ESLint | Latest | Hot-reload and code quality |

---

## 📁 Project Structure

```
StockForge/
├── 📄 README.md                    # Project documentation
├── 📦 package.json                 # Root-level dependencies (if monorepo)
│
├── 📂 client/                      # React frontend application
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 vite.config.js           # Vite bundler configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS customization
│   ├── 📄 eslint.config.js         # Code quality linting
│   ├── 📄 index.html               # HTML entry point
│   ├── 📂 public/
│   │   └── 📂 assets/
│   │       └── 📂 icons/           # Category icons (SVG)
│   └── 📂 src/
│       ├── 📄 main.jsx             # React DOM root
│       ├── 📄 App.jsx              # Root component
│       ├── 📄 index.css            # Global styles
│       ├── 📂 api/
│       │   └── 📄 client.js        # Axios HTTP client setup
│       ├── 📂 components/          # Reusable React components
│       │   ├── 📂 charts/          # Analytics components
│       │   │   ├── LowStockGauge.jsx
│       │   │   ├── StockByCategory.jsx
│       │   │   └── ValueOverTime.jsx
│       │   ├── 📂 inventory/       # Item management components
│       │   │   └── ItemForm.jsx
│       │   ├── 📂 layout/          # Page layout components
│       │   │   ├── Layout.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── Topbar.jsx
│       │   └── 📂 ui/              # Shared UI components
│       │       ├── Badge.jsx
│       │       ├── Button.jsx
│       │       ├── Modal.jsx
│       │       ├── SearchBar.jsx
│       │       ├── StatCard.jsx
│       │       ├── Table.jsx
│       │       └── Toast.jsx
│       ├── 📂 hooks/               # Custom React hooks
│       │   ├── useAuth.jsx         # Authentication management
│       │   ├── useDebounce.js      # Input debouncing
│       │   └── useInventory.js     # Inventory data fetching
│       └── 📂 pages/               # Full-page components
│           ├── Dashboard.jsx       # Main dashboard
│           ├── Inventory.jsx       # Inventory management
│           ├── Categories.jsx      # Category management
│           ├── Trash.jsx           # Deleted items recovery
│           └── Login.jsx           # Authentication page
│
└── 📂 server/                      # Express.js backend application
    ├── 📄 package.json             # Backend dependencies
    ├── 📄 prisma.config.ts         # Prisma configuration
    ├── 📂 prisma/
    │   ├── 📄 schema.prisma        # Database schema (data models)
    │   └── 📄 seed.js              # Database seed/initial data
    └── 📂 src/
        ├── 📄 index.js             # Express server entry point
        ├── 📂 config/
        │   └── 📄 db.js            # Database connection setup
        ├── 📂 controllers/         # Business logic layer
        │   ├── 📄 auth.controller.js
        │   ├── 📄 items.controller.js
        │   └── 📄 categories.controller.js
        ├── 📂 middleware/          # Express middleware
        │   ├── 📄 auth.js          # JWT verification
        │   └── 📄 errorHandler.js  # Centralized error handling
        └── 📂 routes/              # API endpoints
            ├── 📄 auth.routes.js
            ├── 📄 items.routes.js
            └── 📄 categories.routes.js
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18 or higher ([Download](https://nodejs.org))
- **PostgreSQL**: v14+ locally installed (or SQLite for simple development)
- **Git**: For version control
- **npm** or **yarn**: Package manager

### One-Command Setup (Coming Soon)
```bash
# Full automated setup (recommended)
npm run setup:all
```

### Manual Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Albert101255/-StockForge-Multi-Platform-Inventory-Management-System.git
   cd StockForge
   ```

2. **Backend setup** (Terminal 1)
   ```bash
   cd server
   npm install
   npm run db:push
   npm run db:seed
   npm run dev
   # Server runs on http://localhost:5000
   ```

3. **Frontend setup** (Terminal 2)
   ```bash
   cd client
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Access the application**
   - Open [http://localhost:5173](http://localhost:5173) in your browser
   - Login with demo credentials (see below)

**Demo Credentials:**
```
Admin:
  Email:    admin@stockforge.dev
  Password: Admin@1234

Staff:
  Email:    staff@stockforge.dev
  Password: Staff@1234
```

---

## 💻 Local Setup Instructions (Detailed)

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL 14+** running on localhost:5432 (or adjust .env)
- **npm** or **yarn**

### 1. Backend Setup

#### Step 1.1: Navigate to Server Directory
```bash
cd server
```

#### Step 1.2: Install Dependencies
```bash
npm install
```

#### Step 1.3: Configure Environment Variables
Create a `.env` file in the `server/` directory:

```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/stockforge"
# If using SQLite (for development):
# DATABASE_URL="file:./dev.db"

# Server Configuration
NODE_ENV=development
PORT=5000

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# CORS Configuration (Frontend URL)
CORS_ORIGIN=http://localhost:5173
```

#### Step 1.4: Initialize Database
```bash
# Push Prisma schema to database (creates tables)
npm run db:push

# Seed database with sample data
npm run db:seed
```

**Note:** If you encounter `DATABASE_URL` errors, verify PostgreSQL is running:
```bash
# Check PostgreSQL service status
# Windows: Services app > PostgreSQL
# Linux/Mac: sudo systemctl status postgresql
```

#### Step 1.5: Start Backend Development Server
```bash
npm run dev
```

**Expected output:**
```
Server running on http://localhost:5000
Connected to database: stockforge
```

---

### 2. Frontend Setup

#### Step 2.1: Open New Terminal & Navigate to Client
```bash
cd client
```

#### Step 2.2: Install Dependencies
```bash
npm install
```

#### Step 2.3: Configure API Endpoint (Optional)
Create or update `.env` in `client/`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Step 2.4: Start Frontend Development Server
```bash
npm run dev
```

**Expected output:**
```
Local:   http://localhost:5173/
```

#### Step 2.5: Open in Browser
Navigate to [http://localhost:5173](http://localhost:5173) and login with demo credentials.

---

### 3. Production Build

#### Frontend Build
```bash
cd client
npm run build
# Output: client/dist/
```

#### Backend Production Start
```bash
cd server
npm start
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints (except `/auth/login` and `/auth/register`) require JWT token:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints Overview

#### 🔐 Authentication (`/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Create new user account | ❌ |
| POST | `/auth/login` | Authenticate and get JWT token | ❌ |
| POST | `/auth/logout` | Invalidate current session | ✅ |
| GET | `/auth/me` | Get current user profile | ✅ |

#### 📦 Items (`/items`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/items` | List all items (paginated, filterable) | ✅ |
| GET | `/items/:id` | Get single item details | ✅ |
| POST | `/items` | Create new item | ✅ |
| PATCH | `/items/:id` | Update item details | ✅ |
| DELETE | `/items/:id` | Soft-delete item (move to trash) | ✅ |
| DELETE | `/items/:id/permanent` | Permanently delete item (admin only) | ✅ |
| POST | `/items/:id/restore` | Restore item from trash | ✅ |

#### 📂 Categories (`/categories`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/categories` | List all categories | ✅ |
| GET | `/categories/:id` | Get category with items | ✅ |
| POST | `/categories` | Create new category (admin only) | ✅ |
| PATCH | `/categories/:id` | Update category (admin only) | ✅ |
| DELETE | `/categories/:id` | Delete category (admin only) | ✅ |

#### 📊 Stock Logs (`/stock-logs`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stock-logs` | Get all stock movements | ✅ |
| GET | `/stock-logs/:itemId` | Get history for specific item | ✅ |
| POST | `/stock-logs` | Record stock adjustment | ✅ |

### Example Requests

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "staff@stockforge.dev",
    "password": "Staff@1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "staff@stockforge.dev",
    "name": "Staff Member",
    "role": "STAFF"
  }
}
```

#### Get Inventory
```bash
curl -X GET http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create Item
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PS5-GAME-001",
    "name": "Elden Ring",
    "description": "Action RPG for PlayStation 5",
    "price": 59.99,
    "costPrice": 45.00,
    "quantity": 15,
    "lowStockAt": 5,
    "categoryId": 1,
    "supplier": "Sony Interactive"
  }'
```

---

## 🗄️ Database Schema

### Data Models

#### User
```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique              // Login email
  password  String                         // bcrypt hashed
  name      String                        // Display name
  role      String    @default("STAFF")   // ADMIN or STAFF
  createdAt DateTime  @default(now())
  items     Item[]                        // Items created by user
}
```

#### Category
```prisma
model Category {
  id        Int     @id @default(autoincrement())
  name      String  @unique              // e.g., "PS5 Games", "Consoles"
  iconSlug  String                       // Maps to SVG icon filename
  items     Item[]                       // Items in this category
}
```

#### Item
```prisma
model Item {
  id            Int       @id @default(autoincrement())
  sku           String    @unique              // Stock Keeping Unit (unique identifier)
  name          String                        // Product name
  description   String?                       // Optional description
  quantity      Int       @default(0)         // Current stock level
  lowStockAt    Int       @default(5)         // Alert threshold
  price         Float                         // Retail/selling price
  costPrice     Float                         // Cost to acquire
  supplier      String?                       // Supplier name
  categoryId    Int                           // FK to Category
  category      Category  @relation(...)      // Category reference
  isDeleted     Boolean   @default(false)     // Soft delete flag
  createdById   Int                           // FK to User (creator)
  createdBy     User      @relation(...)      // Creator reference
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  history       StockLog[]                    // Stock adjustment history
}
```

#### StockLog
```prisma
model StockLog {
  id        Int      @id @default(autoincrement())
  itemId    Int                              // FK to Item
  item      Item     @relation(...)          // Item reference
  delta     Int                              // +10 = added, -5 = removed
  reason    String?                          // "Restock", "Sale", "Adjustment"
  timestamp DateTime @default(now())         // When change occurred
}
```

### Schema Relationships
```
User (1) ──── (many) Item
  |
  └── tracks creation of items

Category (1) ──── (many) Item
  |
  └── organizes items

Item (1) ──── (many) StockLog
  |
  └── audit trail of all stock changes
```

---

## 🏢 Architecture & Patterns

### Separation of Concerns

**Frontend** & **Backend** are completely decoupled:
- Frontend: React SPA (Single Page Application)
- Backend: RESTful API server
- Communication: JSON over HTTP/HTTPS

**Benefits:**
- Can deploy independently
- Multiple frontend clients (web, mobile, desktop)
- Easy API versioning and evolution
- Frontend can work offline with local caching

### Custom Hooks Architecture

All data fetching is abstracted into custom hooks to maintain UI/logic separation:

```javascript
// useAuth.jsx - Authentication management
const { user, login, logout, isLoading } = useAuth();

// useInventory.jsx - Inventory data fetching
const { items, categories, createItem, updateItem, deleteItem } = useInventory();

// useDebounce.js - Search debouncing
const debouncedValue = useDebounce(searchInput, 500);
```

**Advantages:**
- Reusable across components
- Testable logic without component rendering
- Clean component structure
- Consistent error handling

### Soft Deletion Pattern

Items are "deleted" but preserved:

```javascript
// When user deletes item, it's soft-deleted
PATCH /items/:id { isDeleted: true }

// Item still exists in database (audit trail intact)
// Moved to Trash page for recovery
// If user permanently deletes:
DELETE /items/:id/permanent  // Admin only
```

**Why?**
- Compliance & regulatory requirements
- Preserve audit trail (StockLog history)
- Recover accidentally deleted items
- Maintain data integrity for financial records

### Role-Based Access Control (RBAC)

```javascript
// Admin
✅ Create/update/delete categories
✅ Permanently delete items
✅ View all stock logs

// Staff
✅ Create/update items
✅ Adjust stock levels
❌ Delete categories
❌ Permanently delete items
❌ Cannot modify user roles
```

Implementation: Middleware checks `user.role` on protected routes.

---

## 🎨 Design System

### Color Palette (Dark Theme)
```css
--bg-primary: #0F0F0F;     /* Deep black background */
--bg-secondary: #1A1A1A;   /* Slightly lighter for cards */
--border: #333333;         /* Subtle borders */
--accent-primary: #F5A623; /* Amber/gold for highlights */
--accent-success: #4CAF50; /* Green for positive data */
--accent-danger: #F44336;  /* Red for warnings/deletions */
--text-primary: #FFFFFF;   /* White text */
--text-secondary: #BBBBBB; /* Gray text for secondary info */
```

### Typography
```css
--font-heading: 'Rajdhani';      /* Bold, geometric */
--font-body: 'Segoe UI';         /* Clean, readable */
--font-mono: 'JetBrains Mono';   /* Precise metrics display */
```

### Visual Principles
- **Flat Design**: No gradients or shadows (minimal)
- **Hard Contrast**: Clear distinction between elements
- **No Border Radius**: Sharp, angular design
- **Accessibility**: High contrast ratios (WCAG AA+)
- **Density**: Packed information without clutter

### Component Gallery

Key UI components available for reuse:

| Component | Purpose |
|-----------|---------|
| **Button** | CTA, secondary, danger variants |
| **Badge** | Status indicators and tags |
| **Modal** | Dialogs, confirmations, forms |
| **Toast** | Notifications and alerts |
| **Table** | Data display with sorting/filtering |
| **SearchBar** | Global and contextual search |
| **StatCard** | Key metrics display |
| **Charts** | Recharts-based data visualization |

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select your GitHub repository
   - Configure:
     - **Framework**: Vite / React
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
   - Set environment variables: `VITE_API_URL=<backend-url>`

3. **Deploy**
   - Vercel automatically deploys on push to main branch

### Backend Deployment (Railway/Render/Heroku)

#### Using Railway.app (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub"
   - Select your repository

3. **Configure Environment**
   ```
   DATABASE_URL=postgresql://...
   NODE_ENV=production
   JWT_SECRET=your_production_secret_key
   PORT=3000
   ```

4. **Add PostgreSQL Plugin**
   - Add PostgreSQL from Railway marketplace
   - Automatically sets `DATABASE_URL`

#### Using Render.com

1. **Create Web Service**
   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository
   - Configure:
     - **Root Directory**: `server`
     - **Build Command**: `npm install && npm run db:push`
     - **Start Command**: `npm start`

2. **Add Environment Variables**
   - Same as Railway setup
   - Add PostgreSQL database from marketplace

3. **Deploy**
   - Click "Create Web Service"

### Database Setup for Production

1. **Create PostgreSQL Instance** (using hosting provider)
2. **Update DATABASE_URL** in environment variables
3. **Run migrations**:
   ```bash
   npm run db:push --prod
   npm run db:seed --prod
   ```

### SSL/TLS Configuration
- Enable HTTPS on frontend (automatic with Vercel)
- Enable HTTPS on backend (Railway/Render handle automatically)
- Update CORS_ORIGIN to HTTPS URLs

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
   ```bash
   gh repo fork Albert101255/-StockForge-Multi-Platform-Inventory-Management-System
   ```

2. **Create feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow existing code style
   - Write descriptive commit messages
   - Test your changes locally

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open Pull Request**
   - Describe your changes
   - Reference related issues
   - Wait for code review

### Code Standards

#### Commit Message Format
```
type(scope): subject

body (optional)
footer (optional)
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(inventory): add bulk upload functionality
fix(auth): resolve JWT token expiration issue
docs(readme): update deployment instructions
```

#### Code Style

**Frontend** (React):
- Use hooks-based functional components
- Extract components when reusable (>100 lines)
- Use custom hooks for business logic
- CSS classes via Tailwind + `clsx` for conditionals

**Backend** (Node/Express):
- MVC pattern (routes → controllers → models)
- Use async/await for promise handling
- Centralized error handling with middleware
- Validate inputs before processing

### Testing

```bash
# Frontend tests (when available)
cd client && npm test

# Backend tests (when available)
cd server && npm test
```

### Reporting Issues

Found a bug? Create an issue with:
- Clear title describing the problem
- Reproduction steps
- Expected vs. actual behavior
- Environment (OS, Node version, browser)
- Screenshots/logs if applicable

---

## 🔍 Troubleshooting

### Common Issues & Solutions

#### **Issue: "Cannot connect to database"**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions**:
1. Verify PostgreSQL is running
   ```bash
   # Windows
   services.msc → find PostgreSQL
   
   # Linux
   sudo systemctl status postgresql
   
   # Mac
   brew services list | grep postgresql
   ```

2. Check DATABASE_URL in `.env`
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/stockforge"
   ```

3. Verify PostgreSQL credentials
   ```bash
   psql -U postgres -d stockforge
   ```

---

#### **Issue: "Port 5000/5173 already in use"**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions**:
1. Kill process using port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :5000
   kill -9 <PID>
   ```

2. Change port in `.env`
   ```env
   PORT=3001  # Use different port
   ```

---

#### **Issue: "JWT token is invalid or expired"**

**Solutions**:
1. Ensure JWT_SECRET matches between `.env` files
2. Check token hasn't expired (default 7 days)
3. Clear browser localStorage and re-login
4. Verify header format: `Authorization: Bearer <token>`

---

#### **Issue: "Vite HMR connection failed"**

**Solutions**:
1. Clear browser cache and restart dev server
2. Check frontend is running: `http://localhost:5173`
3. Verify CORS_ORIGIN in backend `.env`
4. Try accessing frontend from `localhost` not IP address

---

#### **Issue: "Prisma migration failed"**

**Solutions**:
```bash
# Reset database (deletes all data)
npm run db:reset

# Or manually push schema
npm run db:push

# Reseed sample data
npm run db:seed
```

---

## 📚 Additional Resources

- **Prisma Documentation**: https://www.prisma.io/docs
- **Express.js Guide**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **JWT Explained**: https://jwt.io/introduction

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

Need help? 
- Check the [Troubleshooting](#-troubleshooting) section
- Search existing [GitHub Issues](https://github.com/Albert101255/-StockForge-Multi-Platform-Inventory-Management-System/issues)
- Open a new [GitHub Discussion](https://github.com/Albert101255/-StockForge-Multi-Platform-Inventory-Management-System/discussions)

---

## 👏 Acknowledgments

- **Icon Library**: Lucide React
- **Charting**: Recharts
- **Database/ORM**: Prisma + PostgreSQL
- **UI Framework**: Tailwind CSS
- **Community**: All contributors and users

---

<div align="center">

**Made with ❤️ by the StockForge Team**

[⬆ Back to top](#-stockforge--multi-platform-inventory-management-system)

</div>
