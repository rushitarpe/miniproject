# Team Task Manager 🗂️

A production-ready **MERN stack** Team Task Manager with Role-Based Access Control (RBAC).

## ✨ Features

- 🔐 JWT Authentication (signup/login with bcrypt password hashing)
- 👑 **Admin**: Create/delete projects, manage members, create/delete tasks
- 👤 **Member**: View assigned projects, update task status
- 📊 Dashboard with stat cards (Total / Completed / Pending / Overdue)
- 📁 Project management with deadline and member tracking
- 🗃️ Kanban task board (Pending → In Progress → Completed)
- 🔴 Overdue task detection and highlighting
- 🌗 Dark glassmorphism UI with Tailwind CSS

---

## 🗂️ Folder Structure

```
team-task-manager/
├── backend/
│   ├── config/         # MongoDB connection
│   ├── controllers/    # Route logic
│   ├── middleware/     # Auth, RBAC, error handling
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routers
│   ├── utils/          # Joi validators
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Navbar, TaskCard, StatCard, ProtectedRoute
        ├── context/    # AuthContext
        └── pages/      # Login, Register, Dashboard, Projects, TaskBoard
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)

### Backend
```bash
cd backend
npm install
cp .env.example .env    # Fill in your values
npm run dev             # Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env    # Set VITE_API_URL=http://localhost:5000/api
npm run dev             # Runs on http://localhost:5173
```

---

## 🌐 API Documentation

### Auth
| Method | Endpoint | Body | Auth |
|--------|----------|------|------|
| POST | `/api/auth/signup` | `{name, email, password, role}` | No |
| POST | `/api/auth/login` | `{email, password}` | No |
| GET | `/api/auth/me` | — | Yes |

### Projects
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/projects` | Yes | All |
| POST | `/api/projects` | Yes | Admin |
| DELETE | `/api/projects/:id` | Yes | Admin |
| POST | `/api/projects/:id/members` | Yes | Admin |
| DELETE | `/api/projects/:id/members/:userId` | Yes | Admin |
| GET | `/api/projects/users` | Yes | Admin |

### Tasks
| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| GET | `/api/tasks` | Yes | All |
| POST | `/api/tasks` | Yes | Admin |
| PUT | `/api/tasks/:id` | Yes | All* |
| DELETE | `/api/tasks/:id` | Yes | Admin |

*Members can only update `status` of tasks assigned to them.

---

## 🚂 Railway Deployment

### Backend Service
1. Connect your GitHub repo to Railway
2. Set **Root Directory** → `backend`
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables:
   ```
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.railway.app
   ```

### Frontend Service
1. Add a second Railway service, same repo
2. Set **Root Directory** → `frontend`
3. Build command: `npm install && npm run build`
4. Start command: `npx serve dist`
5. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

---

## 🗃️ Database Schema

### User
```js
{ name, email, password (hashed), role: 'admin'|'member' }
```

### Project
```js
{ name, description, deadline, members: [User], createdBy: User }
```

### Task
```js
{ title, description, assignedTo: User, projectId: Project, status, dueDate }
// Virtual: isOverdue (computed)
```

---

## 🛡️ Environment Variables

| Variable | Service | Description |
|----------|---------|-------------|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret for signing tokens |
| `PORT` | Backend | Server port (default: 5000) |
| `CLIENT_URL` | Backend | Frontend URL for CORS |
| `NODE_ENV` | Backend | `production` or `development` |
| `VITE_API_URL` | Frontend | Backend API base URL |
