# Authentication System

Full-stack authentication system built with Node.js, Express, MongoDB and React.

The project focuses on implementing authentication and authorization with access tokens, refresh tokens, token rotation, role-based access control and common backend security measures.

## Features

* User registration and login
* Password hashing with bcrypt
* JWT access tokens
* Refresh tokens
* Refresh token rotation
* Refresh token revocation
* HTTP-only cookies
* Email verification
* Password reset
* Role-based authorization
* Request validation with Zod
* Rate limiting
* Security headers with Helmet
* React frontend
* Responsive Bootstrap UI

## Tech Stack

### Backend

* Node.js
* Express
* MongoDB
* Mongoose

### Frontend

* React
* Bootstrap 5

### Authentication & Security

* JWT
* bcrypt
* HTTP-only cookies
* Helmet
* Express Rate Limit
* Zod

### Email

* Nodemailer
* Resend

## Architecture

The application is split into a React frontend and an Express backend.

```text
React Frontend
      |
      | REST API
      v
Express Backend
      |
      +-- Authentication
      +-- Authorization
      +-- Validation
      +-- Security Middleware
      |
      v
MongoDB
```

The frontend is responsible for the user interface and communicating with the API. Authentication, authorization and security-related logic are handled on the backend.

## Authentication Flow

The application uses short-lived access tokens together with refresh tokens.

```text
Login
  |
  v
Validate credentials
  |
  v
Generate access token
  |
  +----> Access token
  |
  +----> Refresh token
              |
              v
        HTTP-only cookie
```

When the access token expires, the refresh token can be used to obtain a new access token.

## Refresh Token Rotation

Refresh tokens are rotated when they are used.

```text
Refresh request
      |
      v
Validate refresh token
      |
      v
Revoke old token
      |
      v
Generate new tokens
```

This allows refresh tokens to be invalidated and limits the lifetime of an individual refresh token.

## Security

### Password hashing

Passwords are hashed with bcrypt before being stored in the database. Plain-text passwords are never stored.

### HTTP-only cookies

Refresh tokens are stored in HTTP-only cookies so they cannot be accessed directly through client-side JavaScript.

### Rate limiting

Rate limiting is applied to help prevent excessive requests to authentication endpoints, including repeated login attempts.

### Security headers

Helmet is used to configure common HTTP security headers.

### Input validation

Request data is validated using Zod before being processed by the application.

## Role-Based Authorization

The application supports two roles:

```text
user
admin
```

Authentication determines the identity of the user, while authorization determines which resources the user can access.

For example, the admin endpoint requires the authenticated user to have the appropriate role.

## Email Verification

After registration, users can verify their email address through a verification link.

```text
Registration
     |
     v
Verification token
     |
     v
Email
     |
     v
Account verification
```

## Password Reset

Users can request a password reset if they have forgotten their password.

```text
Forgot password
      |
      v
Reset token
      |
      v
Email
      |
      v
New password
```

## API

### Authentication

| Method | Endpoint                | Description                   |
| ------ | ----------------------- | ----------------------------- |
| POST   | `/auth/register`        | Register a new user           |
| POST   | `/auth/login`           | Log in                        |
| POST   | `/auth/refresh`         | Refresh authentication tokens |
| POST   | `/auth/logout`          | Log out                       |
| POST   | `/auth/forgot-password` | Request password reset        |
| POST   | `/auth/reset-password`  | Reset password                |

### User

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/user/me`         | Get the current user     |
| GET    | `/user/admin/ping` | Test admin authorization |

## Project Structure

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

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Gojkovix/production-auth-system.git
cd production-auth-system
```

### 2. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

### 3. Environment variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Add the required email provider variables if email verification and password reset are enabled.

### 4. Start the backend

```bash
cd backend
npm run dev
```

### 5. Start the frontend

In a separate terminal:

```bash
cd frontend
npm start
```

## Environment Variables

Secrets should be stored in environment variables and should not be committed to the repository.

Example:

```env
MONGO_URI=...
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
```

## Main Design Decisions

### Access and refresh tokens

Access tokens are used for authenticated API requests and have a shorter lifetime.

Refresh tokens provide a way to obtain new access tokens without requiring the user to log in again.

### Refresh token rotation

A refresh token is invalidated when it is used to obtain a new token pair. This provides better control over active sessions and makes token revocation possible.

### HTTP-only cookies

Refresh tokens are stored in HTTP-only cookies instead of local storage. This prevents client-side JavaScript from directly reading the refresh token.

### Separate authentication and authorization

Authentication and authorization are handled separately. This makes it possible to add additional roles and permissions without changing the basic authentication flow.

## Possible Improvements

Some areas that could be extended further:

* Automated unit and integration tests
* OAuth2 / OpenID Connect
* Multi-factor authentication
* Session and device management
* Audit logging
* Centralized logging and monitoring
* More granular permissions
* Docker deployment
* CI/CD pipeline
* Automated security testing

## Purpose

The project was built to gain a better understanding of authentication systems and backend security.

The main focus was not only getting login and registration working, but understanding how access tokens, refresh tokens, cookies, authorization and security middleware fit together in a full-stack application.

## Author

Lan Gojkovič

Computer Science and Web Technologies student
