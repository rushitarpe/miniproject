================================================================================
                        TEAM TASK MANAGER
             A Production-Ready MERN Stack Application
                   with Role-Based Access Control
================================================================================

  Version   : 1.0.0
  Stack     : MongoDB · Express.js · React (Vite) · Node.js
  Deployed  : Railway (separate backend + frontend services)
  Author    : Team Task Manager Project
  License   : MIT

================================================================================
  TABLE OF CONTENTS
================================================================================

  1.  Project Overview
  2.  Key Features
  3.  Technology Stack
  4.  Folder Structure
  5.  Prerequisites
  6.  Local Development Setup
        5.1  Backend Setup
        5.2  Frontend Setup
  7.  Environment Variables
  8.  API Reference
        7.1  Authentication Endpoints
        7.2  Project Endpoints
        7.3  Task Endpoints
  9.  Database Schema
  10. Role-Based Access Control (RBAC)
  11. Railway Deployment Guide
  12. Known Issues & Troubleshooting
  13. Scripts Reference

================================================================================
  1. PROJECT OVERVIEW
================================================================================

  Team Task Manager is a full-stack collaborative task management application
  built with the MERN stack. It enables teams to organize work into projects,
  assign tasks to members, track progress on a Kanban-style board, and monitor
  deadlines with real-time overdue detection.

  The platform enforces a two-tier role system (Admin / Member) secured with
  JWT authentication and bcrypt password hashing. The UI is built with React
  (Vite) and styled with Tailwind CSS using a dark glassmorphism aesthetic.

================================================================================
  2. KEY FEATURES
================================================================================

  Authentication & Security
  -------------------------
  [*] JWT-based authentication (login / signup)
  [*] Bcrypt password hashing (10 salt rounds)
  [*] Protected routes with token validation middleware
  [*] Role-Based Access Control (Admin / Member)

  Admin Capabilities
  ------------------
  [*] Create and delete projects
  [*] Add / remove team members from projects
  [*] Create and delete tasks within projects
  [*] View all users on the platform
  [*] Full dashboard statistics overview

  Member Capabilities
  -------------------
  [*] View assigned projects only
  [*] Update status of tasks assigned to them
  [*] View personal dashboard statistics

  Task & Project Management
  -------------------------
  [*] Dashboard with stat cards: Total / Completed / Pending / Overdue
  [*] Project management with deadlines and member tracking
  [*] Kanban task board with three lanes:
        Pending --> In Progress --> Completed
  [*] Overdue task detection with visual highlighting
  [*] Due-date tracking per task

  UI / UX
  -------
  [*] Dark glassmorphism design with Tailwind CSS
  [*] Responsive layout (mobile-friendly)
  [*] Toast notifications (react-hot-toast)
  [*] Lucide React icon set

================================================================================
  3. TECHNOLOGY STACK
================================================================================

  BACKEND
  -------
  Runtime        : Node.js >= 18.0.0
  Framework      : Express.js ^4.19.2
  Database       : MongoDB (via Mongoose ^8.4.0)
  Auth           : jsonwebtoken ^9.0.2
  Password Hash  : bcryptjs ^2.4.3
  Validation     : Joi ^17.12.3
  CORS           : cors ^2.8.5
  Config         : dotenv ^16.4.5
  Dev Tool       : nodemon ^3.1.3

  FRONTEND
  --------
  Build Tool     : Vite ^5.2.12
  UI Library     : React ^18.3.1
  Routing        : react-router-dom ^6.23.1
  HTTP Client    : axios ^1.7.2
  Styling        : Tailwind CSS ^3.4.4
  Icons          : lucide-react ^0.395.0
  Notifications  : react-hot-toast ^2.4.1
  Static Serve   : serve ^14.2.6 (production)

================================================================================
  4. FOLDER STRUCTURE
================================================================================

  team-task-manager/
  |
  +-- backend/
  |   +-- config/
  |   |   +-- db.js                  # MongoDB connection (Mongoose)
  |   |
  |   +-- controllers/
  |   |   +-- authController.js      # signup, login, getMe
  |   |   +-- projectController.js   # CRUD + member management
  |   |   +-- taskController.js      # CRUD + status updates
  |   |
  |   +-- middleware/
  |   |   +-- auth.js                # JWT verify middleware
  |   |   +-- rbac.js                # Role check middleware (admin only)
  |   |   +-- errorHandler.js        # Global error handler
  |   |
  |   +-- models/
  |   |   +-- User.js                # User schema (name, email, password, role)
  |   |   +-- Project.js             # Project schema (name, desc, deadline, members)
  |   |   +-- Task.js                # Task schema + isOverdue virtual
  |   |
  |   +-- routes/
  |   |   +-- authRoutes.js          # /api/auth/*
  |   |   +-- projectRoutes.js       # /api/projects/*
  |   |   +-- taskRoutes.js          # /api/tasks/*
  |   |
  |   +-- utils/
  |   |   +-- validators.js          # Joi validation schemas
  |   |
  |   +-- server.js                  # Express app entry point
  |   +-- package.json
  |   +-- railway.toml               # Railway deployment config
  |   +-- nixpacks.toml              # Nixpacks build config
  |   +-- .env                       # Local environment variables (not committed)
  |   +-- .gitignore
  |
  +-- frontend/
  |   +-- src/
  |   |   +-- api/
  |   |   |   +-- axios.js           # Axios instance with base URL + auth header
  |   |   |
  |   |   +-- components/
  |   |   |   +-- Navbar.jsx         # Top navigation bar
  |   |   |   +-- TaskCard.jsx       # Kanban task card component
  |   |   |   +-- StatCard.jsx       # Dashboard stat card component
  |   |   |   +-- ProtectedRoute.jsx # Auth guard wrapper
  |   |   |
  |   |   +-- context/
  |   |   |   +-- AuthContext.jsx    # Global auth state (user, token, login, logout)
  |   |   |
  |   |   +-- pages/
  |   |       +-- Login.jsx          # Login page
  |   |       +-- Register.jsx       # Registration page
  |   |       +-- Dashboard.jsx      # Stats overview page
  |   |       +-- Projects.jsx       # Project list + management page
  |   |       +-- TaskBoard.jsx      # Kanban task board page
  |   |
  |   +-- index.html
  |   +-- package.json
  |   +-- vite.config.js
  |   +-- tailwind.config.js
  |   +-- postcss.config.js
  |   +-- railway.toml
  |   +-- nixpacks.toml
  |   +-- .env                       # Local environment variables (not committed)
  |   +-- .gitignore
  |
  +-- README.md
  +-- README.txt                     # This file
  +-- .gitignore

================================================================================
  5. PREREQUISITES
================================================================================

  Before running this project, ensure you have the following installed:

  [*] Node.js  >= 18.0.0   (https://nodejs.org)
  [*] npm      >= 9.0.0    (comes with Node.js)
  [*] Git                  (https://git-scm.com)
  [*] MongoDB Atlas account (cloud) OR local MongoDB instance

  Optional (for deployment):
  [*] Railway account      (https://railway.app)
  [*] GitHub account       (to connect repo to Railway)

================================================================================
  6. LOCAL DEVELOPMENT SETUP
================================================================================

  Step 1: Clone the repository
  ----------------------------
    git clone <your-repo-url>
    cd team-task-manager

  -----------------------------------------------------------------------
  6.1  BACKEND SETUP
  -----------------------------------------------------------------------

  Step 2: Navigate to backend and install dependencies
  ----------------------------------------------------
    cd backend
    npm install

  Step 3: Create the environment file
  ------------------------------------
    Copy the example below and save as  backend/.env

    MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team-tasks
    JWT_SECRET=your_super_secret_jwt_key_here
    PORT=5000
    CLIENT_URL=http://localhost:5173
    NODE_ENV=development

  Step 4: Start the backend development server
  ---------------------------------------------
    npm run dev

    >> Backend runs at: http://localhost:5000
    >> Uses nodemon for hot-reloading on file changes

  -----------------------------------------------------------------------
  6.2  FRONTEND SETUP
  -----------------------------------------------------------------------

  Step 5: Open a NEW terminal, navigate to frontend
  --------------------------------------------------
    cd frontend
    npm install

  Step 6: Create the environment file
  ------------------------------------
    Save the following as  frontend/.env

    VITE_API_URL=http://localhost:5000/api

  Step 7: Start the frontend development server
  ----------------------------------------------
    npm run dev

    >> Frontend runs at: http://localhost:5173
    >> Hot module replacement (HMR) enabled via Vite

  -----------------------------------------------------------------------

  Both servers must be running simultaneously for the app to work.
  Open your browser and navigate to: http://localhost:5173

================================================================================
  7. ENVIRONMENT VARIABLES
================================================================================

  BACKEND  (backend/.env)
  -----------------------
  Variable      | Required | Default | Description
  --------------|----------|---------|----------------------------------------
  MONGO_URI     | YES      | -       | MongoDB Atlas connection string
  JWT_SECRET    | YES      | -       | Secret key for signing JWT tokens
  PORT          | NO       | 5000    | Port for the Express server
  CLIENT_URL    | YES      | -       | Frontend URL (for CORS allow-list)
  NODE_ENV      | NO       | dev     | 'development' or 'production'

  FRONTEND  (frontend/.env)
  -------------------------
  Variable      | Required | Default | Description
  --------------|----------|---------|----------------------------------------
  VITE_API_URL  | YES      | -       | Full URL to backend API base
                |          |         | e.g. http://localhost:5000/api

  NOTE: Never commit .env files to version control. They are already
        listed in .gitignore for both backend and frontend.

================================================================================
  8. API REFERENCE
================================================================================

  Base URL (local)       : http://localhost:5000/api
  Base URL (production)  : https://<your-backend>.railway.app/api

  All protected endpoints require the header:
    Authorization: Bearer <jwt_token>

  -----------------------------------------------------------------------
  8.1  AUTHENTICATION ENDPOINTS
  -----------------------------------------------------------------------

  POST   /auth/signup
    Body    : { "name": string, "email": string,
                "password": string, "role": "admin"|"member" }
    Auth    : No
    Returns : { token, user }

  POST   /auth/login
    Body    : { "email": string, "password": string }
    Auth    : No
    Returns : { token, user }

  GET    /auth/me
    Auth    : Yes (Bearer token)
    Returns : { user object }

  -----------------------------------------------------------------------
  8.2  PROJECT ENDPOINTS
  -----------------------------------------------------------------------

  GET    /projects
    Auth    : Yes
    Role    : All (members see only assigned projects)
    Returns : [ ...projects ]

  POST   /projects
    Auth    : Yes
    Role    : Admin only
    Body    : { "name": string, "description": string, "deadline": date }
    Returns : { created project }

  DELETE /projects/:id
    Auth    : Yes
    Role    : Admin only
    Returns : { message }

  POST   /projects/:id/members
    Auth    : Yes
    Role    : Admin only
    Body    : { "userId": string }
    Returns : { updated project }

  DELETE /projects/:id/members/:userId
    Auth    : Yes
    Role    : Admin only
    Returns : { updated project }

  GET    /projects/users
    Auth    : Yes
    Role    : Admin only
    Returns : [ ...all users ]

  -----------------------------------------------------------------------
  8.3  TASK ENDPOINTS
  -----------------------------------------------------------------------

  GET    /tasks
    Auth    : Yes
    Role    : All (members see only their assigned tasks)
    Returns : [ ...tasks ]

  POST   /tasks
    Auth    : Yes
    Role    : Admin only
    Body    : { "title": string, "description": string,
                "assignedTo": userId, "projectId": projectId,
                "dueDate": date }
    Returns : { created task }

  PUT    /tasks/:id
    Auth    : Yes
    Role    : Admin (full update) | Member (status only, own tasks)
    Body    : { ...fields to update }
    Returns : { updated task }

  DELETE /tasks/:id
    Auth    : Yes
    Role    : Admin only
    Returns : { message }

================================================================================
  9. DATABASE SCHEMA
================================================================================

  USER
  ----
  Field     | Type    | Constraints
  ----------|---------|------------------------------------------
  name      | String  | Required, trimmed
  email     | String  | Required, unique, lowercase
  password  | String  | Required, bcrypt hashed (never returned)
  role      | String  | Enum: 'admin' | 'member', default: 'member'
  createdAt | Date    | Auto-generated (Mongoose timestamps)
  updatedAt | Date    | Auto-generated (Mongoose timestamps)

  PROJECT
  -------
  Field       | Type       | Constraints
  ------------|------------|------------------------------------------
  name        | String     | Required
  description | String     | Optional
  deadline    | Date       | Optional
  members     | [ObjectId] | References: User
  createdBy   | ObjectId   | References: User, Required
  createdAt   | Date       | Auto-generated
  updatedAt   | Date       | Auto-generated

  TASK
  ----
  Field       | Type     | Constraints
  ------------|----------|------------------------------------------
  title       | String   | Required
  description | String   | Optional
  assignedTo  | ObjectId | References: User
  projectId   | ObjectId | References: Project, Required
  status      | String   | Enum: 'pending'|'in-progress'|'completed'
              |          | Default: 'pending'
  dueDate     | Date     | Optional
  createdAt   | Date     | Auto-generated
  updatedAt   | Date     | Auto-generated

  Virtual Field (not stored in DB):
  ----------------------------------
  isOverdue   | Boolean  | true if dueDate < now AND status != 'completed'

================================================================================
  10. ROLE-BASED ACCESS CONTROL (RBAC)
================================================================================

  Action                          | Admin | Member
  --------------------------------|-------|-------
  Register / Login                |  YES  |  YES
  View own profile (/auth/me)     |  YES  |  YES
  View assigned projects          |  YES  |  YES
  Create a project                |  YES  |  NO
  Delete a project                |  YES  |  NO
  Add member to project           |  YES  |  NO
  Remove member from project      |  YES  |  NO
  List all platform users         |  YES  |  NO
  View assigned tasks             |  YES  |  YES
  Create a task                   |  YES  |  NO
  Update any task field           |  YES  |  NO
  Update status of own task only  |  YES  |  YES
  Delete a task                   |  YES  |  NO

  NOTE: Members attempting admin-only actions receive HTTP 403 Forbidden.

================================================================================
  11. RAILWAY DEPLOYMENT GUIDE
================================================================================

  The app is deployed as TWO separate Railway services from the SAME GitHub repo.

  -----------------------------------------------------------------------
  BACKEND SERVICE
  -----------------------------------------------------------------------

  1. Log into Railway (https://railway.app) and create a New Project
  2. Select "Deploy from GitHub Repo" and connect your repository
  3. In service settings:
       Root Directory  : backend
       Build Command   : npm install
       Start Command   : node server.js
  4. Add the following environment variables in Railway dashboard:

       MONGO_URI    = mongodb+srv://<user>:<pass>@cluster.mongodb.net/team-tasks
       JWT_SECRET   = <your-long-random-secret>
       NODE_ENV     = production
       CLIENT_URL   = https://<your-frontend-service>.railway.app

  5. Deploy and copy the generated public URL.
     Example: https://team-task-backend-production.railway.app

  -----------------------------------------------------------------------
  FRONTEND SERVICE
  -----------------------------------------------------------------------

  1. In the same Railway project, click "+ New Service"
  2. Add another service from the SAME GitHub repo
  3. In service settings:
       Root Directory  : frontend
       Build Command   : npm install && npm run build
       Start Command   : npx serve dist
  4. Add the following environment variable:

       VITE_API_URL = https://<your-backend-service>.railway.app/api

     IMPORTANT: VITE_ variables are baked in at BUILD TIME by Vite.
     If you change this value, you MUST trigger a fresh redeploy/rebuild.

  5. Deploy and verify the app loads at the frontend Railway URL.

  -----------------------------------------------------------------------
  PORT HANDLING ON RAILWAY
  -----------------------------------------------------------------------

  Railway injects a dynamic $PORT environment variable at runtime.
  The backend server.js reads process.env.PORT automatically.
  The frontend serve command binds to 0.0.0.0:$PORT via the start script.
  Do NOT hardcode ports in production configs.

================================================================================
  12. KNOWN ISSUES & TROUBLESHOOTING
================================================================================

  PROBLEM : 502 Bad Gateway on Railway backend
  FIX     : Ensure server.js listens on 0.0.0.0 (not 127.0.0.1) and reads
            PORT from process.env. Check Railway logs for startup errors.

  PROBLEM : Frontend shows blank page / API calls fail in production
  FIX     : Confirm VITE_API_URL is set BEFORE the build step runs.
            The variable is compiled into the static bundle at build time.
            Trigger a fresh Railway redeploy after changing it.

  PROBLEM : CORS errors in browser console
  FIX     : Make sure CLIENT_URL in backend .env exactly matches the
            frontend domain (including https:// and no trailing slash).

  PROBLEM : MongoDB connection timeout / ECONNREFUSED
  FIX     : Verify the MONGO_URI connection string is correct, the IP
            0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access,
            and the DB user has read/write permissions.

  PROBLEM : JWT invalid signature / token expired errors
  FIX     : Ensure JWT_SECRET is the same in .env and on Railway.
            Tokens expire after 7 days by default. Log in again.

  PROBLEM : Member can see tasks/projects they shouldn't
  FIX     : The backend filters by req.user._id. Verify the auth
            middleware is applied to all protected routes.

================================================================================
  13. SCRIPTS REFERENCE
================================================================================

  BACKEND  (run inside /backend)
  -------------------------------
  npm run dev       Start development server with nodemon (hot-reload)
  npm start         Start production server with node

  FRONTEND  (run inside /frontend)
  ---------------------------------
  npm run dev       Start Vite dev server (http://localhost:5173)
  npm run build     Build production bundle to /dist
  npm run preview   Preview production build locally
  npm start         Serve /dist with static file server (production)

================================================================================
  END OF README
================================================================================
