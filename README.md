# Roxx Store Rating Platform

A fullstack web application built with **React (Vite)**, **Express.js**, **Prisma ORM**, and **PostgreSQL** that allows users to submit and modify ratings (1 to 5 stars) for registered stores. Features a unified authentication system with dedicated dashboards for **System Administrators**, **Store Owners**, and **Normal Users**.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** running locally on port `5432`

### 1. Backend Setup
```bash
cd backend
npm install
npx prisma db push
npm run prisma:seed   # Seeds initial admin, owners, users, stores, and ratings
npm start             # Runs backend on http://localhost:5001
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev           # Runs frontend on http://localhost:5173
```

---

## 🔑 Demo User Credentials

The login page contains **Instant Demo Access** quick-fill buttons, or you can use the credentials below:

| Role | Email | Password | Name (Valid 20-60 chars) |
|---|---|---|---|
| **System Administrator** | `admin@roxx.com` | `Admin@1234` | `System Administrator User Account` |
| **Store Owner 1** | `owner1@roxx.com` | `Owner@1234` | `Alexander James Store Owner 1` |
| **Store Owner 2** | `owner2@roxx.com` | `Owner@1234` | `Beatrice Evelyn Store Owner 2` |
| **Normal User 1** | `user1@roxx.com` | `User@1234` | `Christopher Robin Customer One` |
| **Normal User 2** | `user2@roxx.com` | `User@1234` | `Deborah Samantha Customer Two` |

---

## 🛠️ Tech Stack & Key Architectural Decisions

1. **Frontend**:
   - **React 18** with **Vite** for fast hot-module reloading and performance.
   - **Tailwind CSS** with a tailored modern dark glassmorphism design system.
   - **Lucide Icons** for intuitive visual cues.
   - **Axios** with request interceptor automatically attaching JWT tokens and handling expiration.
   - **React Router v6** with `ProtectedRoute` role-based access control.

2. **Backend**:
   - **Express.js** with ES Modules.
   - **Prisma ORM** + **PostgreSQL**.
   - **Zod** schema validation enforcing strict business rules on all inputs.
   - **JWT (JSON Web Tokens)** + **bcryptjs** (10 salt rounds) for password hashing.
   - **Centralized Error Handling**: `errorHandler.js` returning consistent `{ success, message, errors }`.
   - **Security**: `helmet` security headers + `express-rate-limit` rate limiter on auth endpoints.

3. **Database Schema & Constraints**:
   - `User` table with `@@index([role])` and `@@index([name])`.
   - `Store` table with `ownerId @unique` (1 store per owner) and `onDelete: Restrict` for data safety.
   - `Rating` table with `@@unique([userId, storeId])` ensuring one rating per user per store and enabling fast **upsert** behavior.

---

## 📋 Role-Based Functionalities

### 1. System Administrator
- **Dashboard Overview**: Displays real-time counts for **Total Users**, **Total Stores**, and **Total Ratings Submitted**.
- **User Management**:
  - Filter by Name, Email, Address, and Role (`ADMIN`, `USER`, `STORE_OWNER`).
  - Sortable columns (Ascending / Descending) on Name, Email, Address, Role, and Store Rating.
  - **Store Owner Rating Calculation**: Automatically computes and displays the store owner's store average rating (`avg(ratings.rating)` where `store.ownerId = user.id`).
  - **Add New Users**: Create Admin, Normal User, or Store Owner accounts with live rule enforcement.
  - **User Details**: Modal inspection of any user profile and associated store metrics.
- **Store Management**:
  - View all registered stores with Name, Email, Address, and Overall Average Rating.
  - Sortable by Name, Email, Address, Rating, and Review Count.
  - **Register New Store**: Add store and assign to an unassigned `STORE_OWNER`.

### 2. Normal User
- **Registration & Login**: Sign up as a normal user with live validation checklists.
- **Store Directory**:
  - Browse all stores with real-time search across Store Name and Address.
  - View Store Name, Address, Overall Rating, and Personal Submitted Rating.
  - Sortable columns (Store Name, Address, Overall Rating, Your Rating).
- **Interactive Ratings (1 to 5 stars)**:
  - Submit new ratings with interactive star widget.
  - Modify existing ratings seamlessly with instant store average recalculation (upsert).
- **Password Management**: Update password from the navigation bar.

### 3. Store Owner
- **Store Performance Dashboard**:
  - Overall store average rating badge and total customer reviews count.
  - Store profile information (Name, Email, Address).
- **Customer Reviews Table**:
  - Full sortable list of customers who submitted ratings (Customer Name, Email, Location, Rating Given, Submitted Date).
  - Sortable by Customer Name, Email, Rating, and Date.
- **Password Management**: Update account password.

---

## 🛡️ Form Validations Enforced

- **Name**: Min 20 characters, Max 60 characters.
- **Address**: Max 400 characters (non-empty).
- **Password**: 8 to 16 characters, must include at least **1 uppercase letter** and **1 special character** (`!@#$%^&*...`).
- **Email**: Standard RFC-compliant email address.
- **Rating**: Integer between **1 and 5**.

---

## 🧪 Testing & Verification

### Run Automated API & E2E Test Suite
```bash
cd backend
npm run prisma:seed
node src/e2e_full_verification.js
```
*Executes all user journeys (Admin creation, Store linking, User signup, Rating upsert, Password rotation, Store owner analytics, and validation edge cases).*