
# Issue Tracker

A production-quality full-stack Issue Tracker with Auth, CRUD, Search, Filters, and Export.

## 🚀 Live Demo
- **Frontend (Static Site)**: [https://issue-tracker-oo91.onrender.com](https://issue-tracker-oo91.onrender.com)
- **Backend API (Web Service)**: [https://issue-tracker-server-1tox.onrender.com](https://issue-tracker-server-1tox.onrender.com)

## 🚀 Features
- **Auth**: JWT (Access + httpOnly Refresh Token)
- **Dashboard**: Summary cards with status counts
- **CRUD**: Full Issue management (Create, Read, Update, Delete)
- **Advanced List**: 
  - Search by title/description (debounced)
  - Filter by Status, Priority, Severity
  - Sort by date/priority
  - Pagination
- **Export**: Export filtered list to CSV 
- **User Scoped**: Users only see and manage their own issues
- **Business Rules**: Cannot close an issue unless it's resolved (enforced on backend)
- **Premium UI**: Dark mode, Glassmorphism, Framer Motion animations, Sonner toasts

## 🛠️ Tech Stack
- **Frontend**: React, Vite, TypeScript, Tailwind CSS
- **State**: Redux Toolkit (RTK Query)
- **Backend**: Express.js, TypeScript
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod (Backend)
- **Icons**: Lucide React

## 📦 Setup & Environment Variables

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Environment Variables
Create `.env` files in both `client` and `server` folders.

**Client (`client/.env`):**
```env
VITE_API_URL=https://issue-tracker-server-1tox.onrender.com/api
```

**Server (`server/.env`):**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret_1
JWT_REFRESH_SECRET=your_secret_2
CLIENT_URL=https://issue-tracker-oo91.onrender.com
NODE_ENV=production
```
*Note: `PORT` is provided automatically by Render.*

### 3. Installation
From the root directory:
```bash
npm run install:all
```

### 4. Running Locally
From the root directory:
```bash
npm run dev
```

## 🚢 Deployment (Render)

This project is configured for deployment on Render.

### Backend (Web Service)
1.  Connect your repo to Render.
2.  Select **Web Service**.
3.  **Build Command**: `cd server && npm install && npm run build`
4.  **Start Command**: `cd server && npm start`
5.  **Environment Variables**:
    - `PORT`: (Render provides this automatically; code must use `process.env.PORT`)
    - `MONGODB_URI`: Your MongoDB connection string.
    - `JWT_ACCESS_SECRET`: Secret key for signing access tokens.
    - `JWT_REFRESH_SECRET`: Secret key for signing refresh tokens.
    - `CLIENT_URL`: `https://issue-tracker-oo91.onrender.com` (Your frontend URL).
    - `NODE_ENV`: `production` (Optimizes performance and error handling).

### Frontend (Static Site)
1.  Connect your repo to Render.
2.  Select **Static Site**.
3.  **Build Command**: `cd client && npm install && npm run build`
4.  **Publish Directory**: `client/dist`
5.  **Environment Variables**:
    - `VITE_API_URL`: `https://issue-tracker-server-1tox.onrender.com/api`
6.  **Rewrite Rule**:
    - **Source**: `/*`
    - **Destination**: `/index.html`
    - **Action**: `Rewrite`

## ✅ API Health Check
Verify the backend is running correctly:
- **General Health**: [https://issue-tracker-server-1tox.onrender.com/health](https://issue-tracker-server-1tox.onrender.com/health)
- **API Health**: [https://issue-tracker-server-1tox.onrender.com/api/health](https://issue-tracker-server-1tox.onrender.com/api/health)

## 🔧 Common Production Issues & Fixes
- **Refresh shows "Not Found" on frontend**:
  - **Fix**: Add Render rewrite rule `/*` → `/index.html` (Action: **Rewrite**, not Redirect).
- **Frontend calling `localhost:5000` in production**:
  - **Fix**: Update `VITE_API_URL` to the real backend URL in Render Environment Variables and **rebuild** the static site.
- **CORS blocked**:
  - **Fix**: Ensure `CLIENT_URL` in backend Environment Variables matches your actual frontend URL exactly.

## 📄 License
MIT

