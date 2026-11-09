# Student Management System (MERN)

React + Node.js + Express + MongoDB. Features: register/login/logout (JWT), student CRUD, search,
pagination, dashboard statistics, admin/user roles, form validation, loading indicators, responsive UI.

## Setup

You need Node.js 18+ and MongoDB (local, or a free MongoDB Atlas cluster).

### 1. Backend
```
cd backend
npm install
cp .env.example .env     # then edit MONGO_URI and JWT_SECRET
npm run dev
```
Runs on http://localhost:5000

### 2. Frontend (new terminal)
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## Roles
- The first account you register becomes the **admin** (can add, edit and delete students).
- Every later account is a **user** (can view, search and page through students only).
- Role checks are enforced on the backend as well as hidden in the UI.

## API
| Method | Route | Access |
|---|---|---|
| POST | /api/auth/register | public |
| POST | /api/auth/login | public |
| GET | /api/students?search=&page= | logged in |
| GET | /api/students/stats | logged in |
| GET | /api/students/:id | logged in |
| POST | /api/students | admin |
| PUT | /api/students/:id | admin |
| DELETE | /api/students/:id | admin |
