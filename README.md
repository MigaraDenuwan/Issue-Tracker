# Issue Tracker

A production-quality full-stack Issue Tracker with Auth, CRUD, Search, Filters, and Export.

## 🚀 Features
- **Auth**: JWT (Access + httpOnly Refresh Token)
- **Dashboard**: Summary cards with status counts
- **CRUD**: Full Issue management (Create, Read, Update, Delete)
- **Advanced List**: 
  - Search by title/description (debounced)
  - Filter by Status, Priority, Severity
  - Sort by date/priority
  - Pagination
- **Export**: Export filtered list to CSV or JSON
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

## 📦 Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Environment Variables
Create `.env` files in both `client` and `server` folders.

**Server (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_secret_1
JWT_REFRESH_SECRET=your_secret_2
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**Client (.env):**
Vite uses variables starting with `VITE_`.
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

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

## 🚢 Deployment (Vercel)
1. Push to GitHub.
2. Link to Vercel.
3. Set environment variables in Vercel.
4. For backend on Vercel, ensure `vercel.json` is configured (included in project).

## 📄 License
MIT
