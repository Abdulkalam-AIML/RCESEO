# 🚀 RCE SEO Optimizer

> **AI-Powered SEO Content Rewriting Platform** — Hackathon Project

A production-ready MERN stack web application that rewrites website content for SEO optimization using AI scoring, keyword analysis, and readability metrics.

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS, Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios |
| Routing | React Router DOM |
| Backend | Node.js + Express.js |
| Database | MongoDB (RCESEO) + Mongoose |
| Auth | JWT + bcrypt + Google OAuth 2.0 |

---

## 📁 Project Structure

```
RCE SEO optimization/
├── backend/
│   ├── src/
│   │   ├── config/       → db.js, passport.js
│   │   ├── controllers/  → authController.js, rewriteController.js
│   │   ├── middleware/   → auth.js (JWT)
│   │   ├── models/       → User.js, Rewrite.js
│   │   └── routes/       → authRoutes.js, rewriteRoutes.js
│   ├── server.js
│   └── .env
├── frontend/
│   └── src/
│       ├── components/   → Sidebar, DashboardLayout, ProtectedRoute
│       ├── context/      → AuthContext
│       ├── lib/          → api.js (Axios)
│       └── pages/        → Landing, Auth, Dashboard, Rewrite, History, Analytics
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js v18+
- MongoDB running locally (`mongodb://127.0.0.1:27017/RCESEO`)

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env and add your Google OAuth credentials
npm run dev       # starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/RCESEO
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
CLIENT_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add `http://localhost:5000/api/auth/google/callback` as redirect URI
4. Copy Client ID + Secret to `backend/.env`

---

## 🛢️ Database Schema

**Users Collection**
- `name`, `email`, `password` (bcrypt), `googleId`, `avatar`, `createdAt`

**Rewrites Collection**
- `userId`, `originalContent`, `rewrittenContent`, `seoTitle`, `metaDescription`
- `seoScoreBefore`, `seoScoreAfter`, `readabilityScore`, `keywordDensity`
- `keywords.primary`, `keywords.secondary[]`, `tone`, `audience`, `contentType`

---

## 🚀 GitHub Push

```bash
git init
git add .
git commit -m "Initial hackathon project — RCE SEO Optimizer"
git branch -M main
git remote add origin <your_repo_url>
git push -u origin main
```

---

## 📊 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/auth/google` | Google OAuth |
| POST | `/api/rewrite` | Rewrite content |
| GET | `/api/rewrite/history` | Get history |
| GET | `/api/rewrite/analytics` | Get analytics |
| DELETE | `/api/rewrite/:id` | Delete a rewrite |

---

## 🏆 Built for Hackathon

**RCE SEO Optimization** · 2025
