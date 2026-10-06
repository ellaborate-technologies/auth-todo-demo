# 📝 Auth & Todo Task Management System

A robust, full-stack web application featuring secure user authentication (JWT + Bcrypt) and a comprehensive, nested Task & Subtask management system. Built with **React**, **Redux Toolkit**, **React Router**, **Node.js**, **Express**, and **SQLite (Sequelize)** following clean architectural patterns and pure semantic HTML.

---

## 🚀 What Does This Application Do?

This application allows users to register an account, securely log in, and manage their daily tasks and nested subtasks with persistent storage. 

### 1. 🔐 Authentication System (Login & Signup)
* **User Registration:** Allows new users to create an account with username, email, and password. Validates inputs on both client and server sides, encrypts passwords using `bcryptjs`, and saves user records in an SQLite database.
* **User Login:** Authenticates existing users, validates hashed credentials, and issues a secure **JSON Web Token (JWT)** valid for 24 hours.
* **Session Persistence:** Saves session tokens in `localStorage`. Page refreshes do not log the user out; the Redux store seamlessly re-authenticates the user on boot.
* **Route Protection:**
  * **Public Routes (`/login`, `/signup`):** Accessible to unauthenticated visitors. Already authenticated users are automatically redirected to `/tasks`.
  * **Private Routes (`/tasks`):** Protected from unauthorized access. Unauthenticated visitors are automatically redirected to `/login`.
* **User Logout:** Clears both the Redux state and browser `localStorage`, immediately ending the user session and redirecting to the login screen.

### 2. 📋 Todo & Nested Subtasks System
* **Task Creation:** Users can add new high-level tasks. Each task receives a unique timestamp ID and initializes as uncompleted.
* **Task Operations (CRUD):**
  * **Toggle Status:** Mark tasks as completed or pending with immediate UI updates.
  * **Inline Editing:** Edit task titles directly within the list with instant save and cancel controls.
  * **Deletion:** Remove tasks seamlessly.
* **Nested Subtask Management:**
  * Each parent task has its own independent subtask list and separate input form.
  * Subtasks can be created, marked completed/incomplete, edited, and deleted independently of other tasks.
* **Automatic Persistence:** Powered by React `useEffect`, every task or subtask modification is immediately synchronized with browser `localStorage`. No manual "Save" button is required, ensuring zero data loss on page refreshes.

### 3. 🛡️ Pure Semantic HTML & Zero CSS Bloat
* Built with 100% clean, standard semantic HTML tags (`<form>`, `<input>`, `<button>`, `<ul>`, `<li>`, `<header>`, `<nav>`).
* Zero external CSS stylesheets, zero class bloat, and zero inline style dependencies.

---

## 🛠️ Technology Stack

### Frontend
* **React 19:** Component-based UI library.
* **Redux Toolkit:** Centralized global state management for authentication and async thunks.
* **React Router v5:** Declarative client-side routing with `PublicRoutes` and `PrivateRoutes` guards.
* **Axios:** Promise-based HTTP client with a 3-layer fallback error handler.
* **Vite:** High-performance frontend build tool and development server.

### Backend
* **Node.js & Express:** RESTful API server and request routing.
* **Sequelize ORM & SQLite:** Database modeling and local, zero-config relational database storage.
* **BcryptJS:** Salting and one-way password hashing (10 salt rounds).
* **JSONWebToken (JWT):** Cryptographically signed authentication tokens with 24-hour expiration.
* **CORS:** Cross-Origin Resource Sharing middleware enabling secure frontend-backend communication.

---

## 📁 Project Architecture & Directory Structure

```text
my_demo/
├── .gitignore                         # Excludes node_modules, .env, and local databases
├── index.html                         # Clean HTML root document
├── package.json                       # Frontend dependencies and npm scripts
├── vite.config.js                     # Minimal Vite React configuration
├── README.md                          # Comprehensive project documentation
│
├── public/
│   └── favicon.svg                    # Application favicon
│
├── backend/                           # ⚙️ BACKEND (Express + SQLite)
│   ├── .env.example                   # Environment variable template (No secrets)
│   ├── index.js                       # Server entry point (Port 5000)
│   ├── package.json                   # Backend dependencies and scripts
│   └── src/
│       ├── configs/
│       │   └── db.config.js           # SQLite connection via Sequelize ORM
│       ├── controllers/
│       │   └── auth.controller.js     # Request validation & HTTP status responses
│       ├── db/models/
│       │   └── user.model.js          # User database schema & table synchronization
│       ├── errors/
│       │   └── ServiceError.js        # Custom error class with status codes
│       ├── helpers/
│       │   └── password.helper.js     # Bcrypt password hashing & comparison
│       ├── libs/
│       │   └── jwt.js                 # JWT token generation & verification
│       ├── middlewares/
│       │   ├── auth.middleware.js     # Bearer token verification guard
│       │   └── error.middleware.js    # Central global error handling middleware
│       ├── routes/
│       │   └── auth.routes.js         # API route endpoint definitions
│       └── services/
│           └── auth.service.js        # Core authentication business logic
│
└── src/                               # 🖥️ FRONTEND (React + Redux)
    ├── App.jsx                        # BrowserRouter container
    ├── main.jsx                       # React DOM root & Redux Provider
    ├── config/
    │   └── app.config.js              # Central backend base URL config
    ├── network/apis/
    │   └── auth.api.js                # API endpoint directory
    ├── services/
    │   └── auth.service.js            # Axios requests & 3-layer error handling
    ├── utils/
    │   ├── authStorage.js             # LocalStorage helper for user session & JWT
    │   └── taskStorage.js             # LocalStorage helper for Tasks & Subtasks
    ├── redux-store/
    │   ├── store.js                   # Redux global store configuration
    │   └── auth.slice.js              # Auth slice, async thunks, and selectors
    ├── layouts/
    │   └── MainLayout.jsx             # Universal header navbar (Tasks link & Logout)
    ├── pages/
    │   ├── Login/
    │   │   └── index.jsx              # Pure HTML Login form
    │   ├── Signup/
    │   │   └── index.jsx              # Pure HTML Registration form
    │   └── Tasks/
    │       └── index.jsx              # Pure HTML Tasks & Subtasks CRUD interface
    └── routes/
        ├── routesList.js              # Route definitions (/tasks with exact: true)
        ├── routes.jsx                 # Route switcher engine mapping routesList
        ├── PublicRoutes.jsx           # Public route guard (redirects logged-in users)
        └── PrivateRoutes.jsx          # Protected route guard (blocks unauthenticated users)
```

---

## 🔌 API Endpoints Documentation

All endpoints are prefixed with `/api/v1/auth`.

| Method | Endpoint | Access | Description | Request Body | Success Code |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Public | Register a new user | `{ "username": "...", "email": "...", "password": "..." }` | `201 Created` |
| `POST` | `/login` | Public | Authenticate user & get token | `{ "email": "...", "password": "..." }` | `200 OK` |
| `GET` | `/me` | Private | Fetch logged-in user profile | Requires `Bearer <token>` in Authorization header | `200 OK` |
| `POST` | `/logout` | Public | Acknowledge user logout | None | `200 OK` |

### HTTP Status Codes Handled
* **`200 OK`:** Successful login, profile retrieval, or logout.
* **`201 Created`:** New user account successfully created.
* **`400 Bad Request`:** Required request body parameters missing.
* **`401 Unauthorized`:** Incorrect password, invalid credentials, or missing/expired JWT token.
* **`404 Not Found`:** Requested user ID does not exist in the database.
* **`409 Conflict`:** An account with the submitted email address is already registered.
* **`500 Internal Server Error`:** Unhandled server or database exceptions (captured by error middleware).

---

## 🚦 Getting Started Locally

### 1. Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **npm** (v9.0.0 or higher)
* **Git**

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Create a local `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```
   *(On Windows Command Prompt: `copy .env.example .env`)*
4. Start the backend server:
   ```bash
   node index.js
   ```
   *The backend will start and listen on `http://localhost:5000` with the SQLite database automatically initialized.*

### 3. Frontend Setup
1. Open a second terminal window and navigate to the project root directory:
   ```bash
   cd e:/my_demo
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## 🔒 Security Best Practices Implemented

* **Environment Separation:** Sensitive configuration keys (`JWT_SECRET`, database paths) are isolated in `.env` files which are strictly excluded from version control via `.gitignore`.
* **No Plaintext Passwords:** Passwords are hashed using salted Bcrypt before being stored in the database.
* **Token Expiration:** JWT tokens carry an automated 24-hour expiration window.
* **Defensive Error Handling:** Database constraint violations and authentication failures are sanitized before sending responses to clients, preventing information leakage.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
