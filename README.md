<div id="top"></div>

<div align="center">

# 🔐 Production Auth System

Production-ready authentication API built with **Node.js, Express & MongoDB**.

Secure user authentication architecture used in real-world applications.

[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge\&logo=node.js\&logoColor=white)]
[![Express](https://img.shields.io/badge/Express-4-000000?style=for-the-badge\&logo=express\&logoColor=white)]
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)]
[![JWT](https://img.shields.io/badge/Auth-JWT-black?style=for-the-badge)]
[![Security](https://img.shields.io/badge/Security-Production--Ready-red?style=for-the-badge)]

</div>

---

## 🧠 About The Project

This project demonstrates a **production-level authentication system** designed with security, scalability, and real-world architecture in mind.

It implements modern authentication practices used by professional web applications.

The system focuses on:

* Secure user authentication
* Token-based session management
* Backend security best practices
* Scalable architecture design

---

## ✨ Features

* User registration & login
* Password hashing with bcrypt
* JWT access authentication
* Refresh token rotation & revocation
* Secure httpOnly cookie storage
* Email verification & password reset
* Role-based authorization (user / admin)
* Rate limiting & security middleware

---

## 🛠 Built With

### Backend

* Node.js
* Express
* MongoDB & Mongoose

### Security & Auth

* JWT (Access & Refresh Tokens)
* bcrypt password hashing
* Helmet security middleware
* Express Rate Limit
* Secure Cookies

### Utilities

* Nodemailer
* Zod validation

---

## 🚀 API Overview

### Auth Routes

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`
* `POST /auth/logout`
* `POST /auth/forgot-password`
* `POST /auth/reset-password`

### User Routes

* `GET /user/me`
* `GET /user/admin/ping`

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

---

## ▶️ Run Locally

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---

## 🎯 Purpose

This project demonstrates real-world backend security architecture and authentication workflows.

It highlights my focus on:

* Secure authentication systems
* Production-ready backend design
* Scalable API architecture
* Modern security practices

---

## 🤝 Connect With Me

<div align="center">

[![Website](https://img.shields.io/badge/Website-lgojo.si-blue?style=for-the-badge)](https://lgojo.si)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Lan_Gojkovič-0077B5?style=for-the-badge\&logo=linkedin\&logoColor=white)](https://www.linkedin.com/in/lan-gojkovi%C4%8D-b10110363/)
[![GitHub](https://img.shields.io/badge/GitHub-Gojkovix-181717?style=for-the-badge\&logo=github\&logoColor=white)](https://github.com/Gojkovix)

</div>

<p align="right">(<a href="#top">back to top</a>)</p>
