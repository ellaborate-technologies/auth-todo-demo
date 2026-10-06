# 📝 Auth & Todo Task Management System

A robust, production-grade full-stack web application featuring secure user authentication (JWT + Bcrypt) and a comprehensive, nested Task & Subtask management system. Built with **React 19**, **Redux Toolkit**, **React Router v5**, **Node.js**, **Express**, and **SQLite (Sequelize ORM)** following clean architectural patterns and pure semantic HTML without CSS dependencies.

---

## 📌 Table of Contents
- [What Does This Application Do?](#-what-does-this-application-do)
- [Working of Each Feature (Detailed End-to-End Flows)](#-working-of-each-feature-detailed-end-to-end-flows)
  - [1. User Registration Flow](#1-user-registration-flow)
  - [2. User Login & JWT Session Flow](#2-user-login--jwt-session-flow)
  - [3. Route Protection & Navigation Guards](#3-route-protection--navigation-guards)
  - [4. Tasks & Nested Subtasks CRUD Flow](#4-tasks--nested-subtasks-crud-flow)
  - [5. Logout & Session Termination](#5-logout--session-termination)
- [Technology Stack](#-technology-stack)
- [Project Architecture & Directory Structure](#-project-architecture--directory-structure)
- [File-by-File Responsibilities & Logic](#-file-by-file-responsibilities--logic)
  - [Backend Structure](#backend-structure)
  - [Frontend Structure](#frontend-structure)
- [Database Schema & Data Models](#-database-schema--data-models)
- [API Endpoints Documentation](#-api-endpoints-documentation)
- [Getting Started Locally](#-getting-started-locally)
- [Security Best Practices](#-security-best-practices)

---

## 🚀 What Does This Application Do?

This application is a full-featured management tool designed around two core systems:

1. **Authentication & Authorization System**: Enables users to securely register an account, log in with password hashing, receive signed JSON Web Tokens (JWT), persist sessions across page reloads, and protect private routes from unauthorized access.
2. **Hierarchical Todo & Subtask System**: Provides a multi-level task management interface where each task can contain nested subtasks. It supports complete CRUD (Create, Read, Update/Edit, Delete) operations and status toggling (completed / pending), persisting all data automatically to browser storage without requiring manual saves.
3. **Pure Semantic HTML UI**: Designed using strict semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<form>`, `<input>`, `<ul>`, `<li>`, `<button>`) with zero CSS stylesheets and zero class bloat, demonstrating pure functional front-end architecture.

---

## 🔄 Working of Each Feature (Detailed End-to-End Flows)

### 1. User Registration Flow
```
User inputs Form -> Frontend Validation -> Redux Async Thunk -> Axios Service -> Express Route -> Controller -> Service -> Bcrypt Hash -> SQLite DB
```
* **Step 1 (Input & Submission):** The user enters their `username`, `email`, and `password` on the `/signup` page.
* **Step 2 (Client Validation):** Before dispatching, the component ensures fields are not blank and password meets minimal requirements.
* **Step 3 (Redux Dispatch):** The component calls `dispatch(registerUser({ username, email, password }))`.
* **Step 4 (HTTP Request):** Axios sends a `POST` request to `/api/v1/auth/register` on `http://localhost:5000`.
* **Step 5 (Controller & Validation):** `auth.controller.js` checks for missing parameters. If missing, it returns `400 Bad Request`.
* **Step 6 (Service & Duplicate Check):** `auth.service.js` queries SQLite via Sequelize to verify if the email is already in use. If found, it throws a `409 Conflict` error.
* **Step 7 (Password Hashing):** The password helper salts and hashes the plaintext password using `bcryptjs.hash(password, 10)` so plaintext passwords are never stored.
* **Step 8 (Database Insert):** A new record is created in the SQLite `users` table.
* **Step 9 (Response & Redirect):** The server responds with `201 Created`. The frontend receives the success response and redirects the user to `/login` to sign in.

---

### 2. User Login & JWT Session Flow
```
Login Form -> Redux loginUser Thunk -> Backend Verification -> Bcrypt Compare -> JWT Generation -> LocalStorage Sync -> Redux State Update -> Redirect to /tasks
```
* **Step 1 (Submission):** The user provides their `email` and `password` on the `/login` page.
* **Step 2 (Backend Authentication):** `auth.service.js` fetches the user record by email. If no user exists, it returns `401 Unauthorized`.
* **Step 3 (Password Verification):** `bcryptjs.compare(password, user.password)` verifies the hashed password against the user input. If mismatched, it returns `401 Unauthorized`.
* **Step 4 (JWT Signing):** Upon successful verification, `jwt.sign()` generates a cryptographically signed JSON Web Token containing the user ID and email with a 24-hour expiration (`expiresIn: '24h'`).
* **Step 5 (Client Storage Sync):** Redux `loginUser.fulfilled` stores the user object and token in state, and `authStorage.setToken(token)` writes the token into browser `localStorage`.
* **Step 6 (Session Persistence):** When the user refreshes the page, `authStorage.getUser()` and `authStorage.getToken()` are read during Redux store initialization, keeping the user securely logged in without interrupting their workflow.

---

### 3. Route Protection & Navigation Guards
The routing system is structured into two route wrappers:
* **`PublicRoutes.jsx` (`/login`, `/signup`):**
  * Checks `isAuthenticated` from the Redux store.
  * If the user is already logged in, it redirects them immediately to `/tasks`.
  * If the user is unauthenticated, it renders the login or signup page.
* **`PrivateRoutes.jsx` (`/tasks`):**
  * Checks `isAuthenticated` and token presence.
  * If the user is not authenticated, it blocks access and redirects them to `/login`.
  * If authenticated, it renders the protected page wrapped inside `MainLayout`.
* **`routesList.js` & `routes.jsx`:**
  * Centralizes application route configurations (`path: '/tasks'`, `exact: true`).

---

### 4. Tasks & Nested Subtasks CRUD Flow
```
Tasks UI -> State Mutation -> Auto-Save to LocalStorage -> Re-render Tree
```
* **Task Creation:**
  * User inputs a task title into the top form and submits.
  * A new task object is created:
    ```javascript
    {
      id: Date.now(),
      title: "Complete Documentation",
      completed: false,
      subtasks: []
    }
    ```
* **Task Operations:**
  * **Toggle Status:** Flips the `completed` boolean flag (`true` / `false`).
  * **Inline Edit:** Clicking "Edit" sets the task ID into `editingTaskId` state, rendering an inline input box. Submitting updates the title and resets the editing state.
  * **Delete:** Filters out the task by its unique `id`.
* **Nested Subtask Operations:**
  * Each task includes a dedicated subtask form.
  * Subtasks are stored in the parent's `subtasks` array:
    ```javascript
    {
      id: Date.now(),
      title: "Write API section",
      completed: false
    }
    ```
  * Subtasks have their own independent toggle, inline edit, and delete functions scoped strictly to their parent task.
* **Automated Persistence:**
  * Handled via React's `useEffect`:
    ```javascript
    useEffect(() => {
      taskStorage.saveTasks(tasks);
    }, [tasks]);
    ```
  * Any addition, deletion, edit, or toggle instantly updates `localStorage`. When the user reloads or re-opens the browser, their exact task and subtask hierarchy is restored.

---

### 5. Logout & Session Termination
* Clicking "Logout" in `MainLayout.jsx` calls `dispatch(logoutUser())`.
* The Redux action clears user details and token from the Redux state.
* `authStorage.clearAuth()` purges tokens from `localStorage`.
* The user is immediately redirected to `/login`, revoking access to protected routes.

---

## 🛠️ Technology Stack

### Frontend
* **React 19:** Functional components with React Hooks (`useState`, `useEffect`).
* **Redux Toolkit (`@reduxjs/toolkit` & `react-redux`):** Centralized global store, slices, and async thunks.
* **React Router v5 (`react-router-dom`):** Declarative routing, `Route`, `Switch`, `Redirect`.
* **Axios:** HTTP client with error mapping and base URL configuration.
* **Vite:** Next-generation frontend tooling with instant HMR (Hot Module Replacement).

### Backend
* **Node.js & Express:** Lightweight, scalable REST API web framework.
* **Sequelize ORM & SQLite:** Zero-setup embedded relational SQL database engine (`sqlite3`).
* **BcryptJS (`bcryptjs`):** Industrial-standard password hashing algorithm.
* **JSONWebToken (`jsonwebtoken`):** Stateless bearer token authentication.
* **CORS (`cors`):** Cross-Origin Resource Sharing handling for frontend requests.
* **Dotenv (`dotenv`):** Environment variable loading from `.env`.

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
│       │   └── auth.middleware.js     # Bearer token verification guard
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

## 📑 File-by-File Responsibilities & Logic

### Backend Structure
* **`backend/index.js`:** Express server entry point. Sets up CORS, JSON body parser, registers API routes at `/api/v1/auth`, synchronizes Sequelize with SQLite, and initializes the global error middleware.
* **`backend/src/configs/db.config.js`:** Configures Sequelize with the SQLite dialect and specifies the storage file (`backend/database.sqlite`).
* **`backend/src/db/models/user.model.js`:** Defines the Sequelize schema for the `User` entity (`username`, `email`, `password`) and synchronizes the table.
* **`backend/src/controllers/auth.controller.js`:** Validates request bodies (e.g. checks email and password existence) and maps service responses to appropriate HTTP status codes (`201 Created`, `200 OK`).
* **`backend/src/services/auth.service.js`:** Core business logic for authentication. Executes database lookups, checks for existing accounts, hashes passwords, verifies credentials, and issues tokens.
* **`backend/src/helpers/password.helper.js`:** Wraps `bcryptjs` functions (`hashPassword` and `comparePassword`) with 10 salt rounds.
* **`backend/src/libs/jwt.js`:** Utilities for signing JWT tokens with a secret key and verifying incoming tokens.
* **`backend/src/middlewares/auth.middleware.js`:** Intercepts requests, validates `Authorization: Bearer <token>`, extracts user details, and rejects unauthenticated calls with `401 Unauthorized`.
* **`backend/src/middlewares/error.middleware.js`:** Centralized error catcher that formats error messages and status codes, preventing server crashes.
* **`backend/src/errors/ServiceError.js`:** Extends JavaScript's standard `Error` class to encapsulate custom HTTP status codes.

### Frontend Structure
* **`src/main.jsx`:** Mounts the React application to the DOM and wraps it with the Redux `<Provider store={store}>`.
* **`src/App.jsx`:** Renders the `<BrowserRouter>` and mounts top-level routes.
* **`src/redux-store/store.js`:** Combines reducers and exports the central Redux store.
* **`src/redux-store/auth.slice.js`:** Houses authentication state (`user`, `token`, `isAuthenticated`, `isLoading`, `error`) and async thunks (`registerUser`, `loginUser`, `fetchUserProfile`, `logoutUser`).
* **`src/services/auth.service.js`:** Executes Axios HTTP calls with a 3-layer error fallback (`response.data.message` -> `request error` -> `setup error`).
* **`src/network/apis/auth.api.js`:** Central catalog of backend API endpoints.
* **`src/config/app.config.js`:** Stores base URL configuration (`http://localhost:5000/api/v1`).
* **`src/utils/authStorage.js`:** Manages reading and writing auth tokens and user data in browser `localStorage`.
* **`src/utils/taskStorage.js`:** Reads and writes the nested tasks and subtasks array in `localStorage`.
* **`src/routes/PublicRoutes.jsx`:** Route protection guard that allows guests and redirects authenticated users to `/tasks`.
* **`src/routes/PrivateRoutes.jsx`:** Route protection guard that blocks guests and redirects unauthenticated users to `/login`.
* **`src/routes/routesList.js` & `src/routes/routes.jsx`:** Array-based routing map that dynamically renders private route paths with exact matching.
* **`src/layouts/MainLayout.jsx`:** Semantic `<header>` and `<nav>` layout offering easy navigation and the Logout button.
* **`src/pages/Login/index.jsx`:** Semantic login form with status messaging and links to registration.
* **`src/pages/Signup/index.jsx`:** Semantic signup form with input fields for username, email, and password.
* **`src/pages/Tasks/index.jsx`:** The core task management interface containing full CRUD for tasks and nested subtasks with inline editing and auto-save.

---

## 🗄️ Database Schema & Data Models

### User Model (`users` table)
| Column Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | Primary Key, Auto Increment | Unique user identifier |
| `username` | `STRING` | NOT NULL | User's display name |
| `email` | `STRING` | NOT NULL, UNIQUE | User's unique login email |
| `password` | `STRING` | NOT NULL | Bcrypt-hashed password |
| `createdAt` | `DATETIME` | Auto-generated | Record creation timestamp |
| `updatedAt` | `DATETIME` | Auto-generated | Record last modified timestamp |

---

## 🔌 API Endpoints Documentation

All endpoints are hosted at `http://localhost:5000/api/v1/auth`.

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

## 🔒 Security Best Practices

* **Environment Separation:** Sensitive configuration keys (`JWT_SECRET`, database paths) are isolated in `.env` files which are strictly excluded from version control via `.gitignore`.
* **No Plaintext Passwords:** Passwords are hashed using salted Bcrypt before being stored in the database.
* **Token Expiration:** JWT tokens carry an automated 24-hour expiration window.
* **Defensive Error Handling:** Database constraint violations and authentication failures are sanitized before sending responses to clients, preventing information leakage.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
