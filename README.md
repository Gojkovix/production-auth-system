<div id="top"></div>

<div align="center">

# 🔐 Production Authentication System

### Secure, token-based authentication architecture built with Node.js, Express, MongoDB and React.

A full-stack authentication system designed around **secure session management, refresh token rotation, role-based authorization and defensive backend security practices**.

<br />

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge\&logo=node.js\&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge\&logo=express\&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)](https://react.dev/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-black?style=for-the-badge)](https://jwt.io/)
[![Security](https://img.shields.io/badge/Security-Focused-red?style=for-the-badge)]()

</div>

---

## 📌 Overview

Authentication is one of the most security-sensitive parts of a web application.

This project was built to explore and implement a **complete authentication architecture** rather than a simple username/password login flow.

The system handles:

* User registration and authentication
* Password hashing
* Access and refresh tokens
* Refresh token rotation
* Token revocation
* HTTP-only cookie storage
* Email verification
* Password reset
* Role-based authorization
* Request validation
* Rate limiting
* Security headers
* Protected API routes

The frontend provides a React-based interface for interacting with the authentication API.

---

## 🎯 Project Goals

The main goal was to understand how authentication systems are designed in real applications and how different security mechanisms work together.

The project focuses on four areas:

### 🔐 Security

Protect credentials, sessions and API endpoints against common attack vectors.

### 🧩 Authentication Architecture

Separate short-lived access tokens from long-lived refresh tokens and implement token lifecycle management.

### 🏗️ Backend Design

Build a structured REST API with authentication middleware, validation and authorization layers.

### 💻 Full-Stack Integration

Connect the authentication API to a React frontend while keeping authentication state and sensitive tokens properly isolated.

---

# 🏗️ Architecture

The application follows a client-server architecture:

```text
┌──────────────────────────┐
│       React Client       │
│                          │
│  Login / Register        │
│  Dashboard               │
│  Password Reset          │
│  Account Management      │
└────────────┬─────────────┘
             │
             │ HTTP / REST API
             ▼
┌──────────────────────────┐
│      Express Server      │
│                          │
│  Routes                  │
│  Controllers             │
│  Middleware              │
│  Authentication          │
│  Authorization           │
│  Validation              │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────┐
│      MongoDB Atlas       │
│                          │
│  Users                   │
│  Refresh Tokens          │
│  Authentication Data     │
└──────────────────────────┘
```

The backend is responsible for authentication and authorization logic, while the React application acts as the client consuming the REST API.

---

# 🔑 Authentication Flow

The application uses **short-lived JWT access tokens** together with **refresh tokens**.

### Login

```text
User
 │
 │ credentials
 ▼
POST /auth/login
 │
 ├── Validate input
 │
 ├── Find user
 │
 ├── Verify password
 │
 └── Generate tokens
       │
       ├── Access Token
       │
       └── Refresh Token
              │
              ▼
        HTTP-only Cookie
```

The access token is used for authenticated API requests, while the refresh token is used to obtain a new access token when the access token expires.

---

# 🔄 Refresh Token Rotation

Refresh tokens are not treated as permanent credentials.

When a refresh request is made:

```text
Client
  │
  │ Refresh Token
  ▼
POST /auth/refresh
  │
  ├── Validate token
  │
  ├── Check token state
  │
  ├── Revoke old token
  │
  └── Issue new tokens
          │
          ├── New Access Token
          └── New Refresh Token
```

The previous refresh token is invalidated during rotation.

This reduces the lifetime of a compromised refresh token and provides a mechanism for token revocation.

---

# 🛡️ Security

Security was a major design consideration throughout the project.

## Password Hashing

Passwords are never stored as plain text.

Passwords are hashed using **bcrypt** before being stored in the database.

```text
Plain Password
      │
      ▼
   bcrypt
      │
      ▼
Password Hash
      │
      ▼
   MongoDB
```

---

## HTTP-only Cookies

Refresh tokens are stored using **HTTP-only cookies**.

This prevents client-side JavaScript from directly accessing the refresh token through `document.cookie`.

The browser handles the cookie automatically when communicating with the API.

---

## JWT Access Tokens

Access tokens are short-lived credentials used to authorize protected API requests.

The server validates the token before allowing access to protected resources.

Example:

```text
Authorization: Bearer <access-token>
```

---

## Refresh Token Revocation

Refresh tokens can be revoked when necessary.

This is important for scenarios such as:

* User logout
* Token rotation
* Suspicious sessions
* Compromised credentials
* Session invalidation

---

## Rate Limiting

Authentication endpoints are protected using request rate limiting.

This helps reduce the effectiveness of automated attacks such as:

* Brute-force password attempts
* Credential stuffing
* Excessive authentication requests

---

## Security Headers

The application uses **Helmet** to configure common HTTP security headers.

This provides an additional defensive layer at the HTTP level.

---

## Input Validation

Incoming request data is validated before being processed.

The project uses **Zod** for schema-based validation.

This helps prevent malformed or unexpected input from reaching application logic.

---

# 👤 Role-Based Authorization

The application supports multiple user roles.

Currently:

```text
USER
ADMIN
```

Authentication answers:

> "Who are you?"

Authorization answers:

> "What are you allowed to do?"

For example, the admin endpoint:

```http
GET /user/admin/ping
```

requires the authenticated user to have the appropriate role.

This keeps authentication and authorization as separate concepts within the backend.

---

# 📧 Email Verification & Password Reset

The authentication system also supports account recovery and verification workflows.

### Email Verification

```text
Register
   │
   ▼
Verification Token
   │
   ▼
Email
   │
   ▼
User verifies account
```

### Password Reset

```text
Forgot Password
       │
       ▼
Reset Token
       │
       ▼
Email
       │
       ▼
Reset Password
```

Email functionality can be integrated using:

* Nodemailer
* Resend

---

# 📡 REST API

## Authentication

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| `POST` | `/auth/register`        | Create a new account          |
| `POST` | `/auth/login`           | Authenticate a user           |
| `POST` | `/auth/refresh`         | Refresh authentication tokens |
| `POST` | `/auth/logout`          | End the current session       |
| `POST` | `/auth/forgot-password` | Request password reset        |
| `POST` | `/auth/reset-password`  | Reset account password        |

## User

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| `GET`  | `/user/me`         | Get authenticated user   |
| `GET`  | `/user/admin/ping` | Test admin authorization |

---

# 🗂️ Project Structure

The project is separated into frontend and backend responsibilities.

```text
production-auth-system/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── ...
│
├── .gitignore
├── README.md
└── package.json
```

> The exact structure may evolve as the application grows.

---

# 🛠️ Technology Stack

## Backend

* **Node.js**
* **Express**
* **MongoDB**
* **Mongoose**

## Frontend

* **React**
* **Bootstrap 5**
* Responsive UI
* Component-based architecture

## Authentication

* **JWT**
* Access tokens
* Refresh tokens
* Refresh token rotation
* Token revocation
* HTTP-only cookies

## Security

* **bcrypt**
* **Helmet**
* **Express Rate Limit**
* **Zod**
* Secure cookie configuration

## Email

* **Nodemailer**
* **Resend**

---

# ⚙️ Getting Started

## 1. Clone the repository

```bash
git clone https://github.com/Gojkovix/production-auth-system.git

cd production-auth-system
```

---

## 2. Install dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

---

## 3. Configure environment variables

Create a `.env` file inside the backend directory:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

If email functionality is enabled, configure the required email provider variables as well.

---

## 4. Start the backend

```bash
cd backend
npm run dev
```

The API will run on the configured port.

---

## 5. Start the frontend

In another terminal:

```bash
cd frontend
npm start
```

The React application will then connect to the authentication API.

---

# 🔒 Environment Variables

Secrets should never be committed to the repository.

Example:

```env
MONGO_URI=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

The actual values should remain in environment configuration and should not be exposed to the frontend.

---

# 🧪 Example Authentication Request

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

The server validates the credentials and establishes an authenticated session.

---

# 📈 Design Considerations

Several design decisions were made intentionally.

### Why access + refresh tokens?

Access tokens should have a relatively short lifetime.

Refresh tokens allow the user to remain authenticated without requiring the user to enter their password again whenever an access token expires.

This provides a balance between:

* Security
* User experience
* Session lifetime

---

### Why HTTP-only cookies?

Sensitive refresh credentials should not be directly accessible to client-side JavaScript.

HTTP-only cookies reduce the exposure of refresh tokens to certain client-side attacks such as token theft through JavaScript.

---

### Why rotate refresh tokens?

A stolen refresh token should not remain useful indefinitely.

Rotation allows the server to invalidate the previous token when a new one is issued.

---

### Why separate authentication and authorization?

Authentication identifies the user.

Authorization determines what that user can access.

Keeping these concerns separate makes the system easier to reason about and extend.

---

# 🚧 Current Limitations

This project is primarily focused on authentication architecture and security concepts.

Potential improvements include:

* Automated integration tests
* More comprehensive API documentation
* Session/device management
* Centralized logging
* Monitoring and alerting
* More granular permissions
* Improved refresh-token reuse detection
* CSRF protection depending on deployment architecture
* Automated security testing
* Docker-based deployment
* CI/CD pipeline

These would be natural next steps for a larger production deployment.

---

# 🔮 Future Improvements

Possible extensions include:

### Authentication

* OAuth2 / OpenID Connect
* Google authentication
* GitHub authentication
* Multi-factor authentication
* Device/session management

### Security

* Refresh-token reuse detection
* Account lockout policies
* Security event logging
* Suspicious login detection
* Audit logs

### Infrastructure

* Docker
* CI/CD
* Automated testing
* Centralized logging
* Monitoring

---

# 📚 What This Project Demonstrates

This project demonstrates practical experience with:

* REST API design
* Authentication architecture
* JWT-based authentication
* Refresh token lifecycle management
* Password security
* Role-based authorization
* HTTP-only cookies
* Backend middleware
* Request validation
* Rate limiting
* Security headers
* MongoDB data modeling
* React API integration
* Full-stack application architecture

---

# 🎓 Why I Built This

The project was created to gain a deeper understanding of how authentication systems work beyond a basic login form.

Instead of treating authentication as a single endpoint, the project explores the complete lifecycle of an authenticated session:

```text
Registration
     ↓
Email Verification
     ↓
Login
     ↓
Access Token
     ↓
Refresh Token
     ↓
Token Rotation
     ↓
Authorization
     ↓
Logout / Revocation
```

The goal was to understand the **security and architectural decisions behind authentication**, not simply implement a working login system.

---

# 👨‍💻 Author

**Lan Gojkovič**

Computer Science & Web Technologies student

Interested in:

* Software Engineering
* Backend Development
* Full-Stack Development
* Application Security
* Distributed Systems
* Cloud Technologies

---

<div align="center">

### ⭐ If you find the project useful, consider giving it a star.

[⬆ Back to top](#top)

</div>
