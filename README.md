<div id="top"></div>

<div align="center">

# 🔐 Production Auth System

Production-ready authentication system built with **Node.js, Express, MongoDB** and a modern **React + Bootstrap frontend**.

Secure authentication architecture used in real-world applications.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)]
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express&logoColor=white)]
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)]
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)]
[![Bootstrap](https://img.shields.io/badge/UI-Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)]
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge)]
[![Security](https://img.shields.io/badge/Security-Production--Ready-red?style=for-the-badge)]

</div>

---

## 🧠 About The Project

This project demonstrates a **production-level authentication system** designed with security, scalability, and real-world architecture in mind.

It implements modern authentication practices used by professional web applications and provides a clean, responsive frontend interface.

The system focuses on:

- Secure user authentication
- Token-based session management
- Backend security best practices
- Scalable architecture design
- Responsive user interface

---

## ✨ Features

- User registration & login
- Password hashing with bcrypt
- JWT access authentication
- Refresh token rotation & revocation
- Secure httpOnly cookie storage
- Email verification & password reset
- Role-based authorization (user / admin)
- Rate limiting & security middleware
- Responsive React UI
- Clean Bootstrap-based design

---

## 🛠 Built With

### Backend

- Node.js
- Express
- MongoDB & Mongoose

### Frontend

- React
- Bootstrap 5
- Responsive layout
- Component-based architecture
- API integration

### Security & Auth

- JWT (Access & Refresh Tokens)
- bcrypt password hashing
- Helmet security middleware
- Express Rate Limit
- Secure Cookies

### Utilities

- Nodemailer / Resend
- Zod validation

---

## 🖥 Frontend Overview

The frontend provides a clean and responsive user interface for authentication workflows.

**Key UI features:**

- Login & registration forms
- Secure authentication handling
- Responsive design for mobile & desktop
- Modern component structure
- Error & success feedback messaging

---

## 🚀 API Overview

### Auth Routes

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### User Routes

- `GET /user/me`
- `GET /user/admin/ping`

---

## ⚙️ Environment Setup

Create a `.env` file:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_connection_string

JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
```
