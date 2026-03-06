# CampusOne

A full-stack campus management system built with React + Node.js + MongoDB. It provides a centralized platform for managing students, courses, events, inquiries, inventory, and staff — with role-based access control and a clean dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Modules](#modules)
- [Data Models](#data-models)
- [API Reference](#api-reference)
- [Authentication & Authorization](#authentication--authorization)
- [Security](#security)
- [Frontend Routing](#frontend-routing)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)

---

## Overview

CampusOne is a role-aware admin panel for educational institutions. Staff members can log in and manage day-to-day operations: track student records, handle inquiries from prospects, manage course offerings, organize events, and monitor product/inventory stock. A dedicated student-facing home view is also included.

The application separates concerns cleanly into a **backend REST API** (`/be`) and a **frontend SPA** (`/fe`).

---

## Tech Stack

### Backend (`/be`)
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB via Mongoose v9 |
| Authentication | JSON Web Tokens (jsonwebtoken) |
| Password hashing | bcryptjs |
| Validation | express-validator |
| File uploads | Multer |
| API documentation | Swagger (swagger-jsdoc + swagger-ui-express) |
| Security | Helmet, CORS, express-rate-limit |
| Logging | Morgan |
| Dev server | Nodemon |

### Frontend (`/fe`)
| Layer | Technology |
|---|---|
| UI library | React 19 |
| Build tool | Vite 7 |
| Styling | Tailwind CSS v4 |
| Component primitives | Radix UI (dialog, select, checkbox, radio, label) |
| Routing | React Router v7 |
| Forms | React Hook Form |
| HTTP client | Axios |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge, class-variance-authority |

---

## Project Structure

```
CampusOne/
├── be/                          # Backend (Node.js API)
│   ├── server.js                # Entry point
│   ├── src/
│   │   ├── app.js               # Express app setup, middleware, routes
│   │   ├── config/
│   │   │   ├── config.js        # Environment config
│   │   │   ├── db.js            # MongoDB connection
│   │   │   └── swagger.js       # Swagger/OpenAPI config
│   │   ├── controllers/         # Route handlers (business logic)
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── studentController.js
│   │   │   ├── courseController.js
│   │   │   ├── eventController.js
│   │   │   ├── inquiryController.js
│   │   │   ├── productController.js
│   │   │   ├── todoController.js
│   │   │   └── dashboardController.js
│   │   ├── models/              # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Student.js
│   │   │   ├── Course.js
│   │   │   ├── Event.js
│   │   │   ├── Inquiry.js
│   │   │   ├── Product.js
│   │   │   └── Todo.js
│   │   ├── routes/              # Express routers
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT protect middleware
│   │   │   ├── roleCheck.js     # Role-based authorization
│   │   │   ├── upload.js        # Multer file upload
│   │   │   ├── validate.js      # Validation error handler
│   │   │   └── errorHandler.js  # Global error handler
│   │   ├── validators/          # express-validator rule sets
│   │   ├── utils/
│   │   │   ├── ApiError.js      # Custom error class
│   │   │   ├── ApiResponse.js   # Standardized response helper
│   │   │   └── asyncHandler.js  # Async try/catch wrapper
│   │   └── seed.js              # Database seeder
│   └── uploads/
│       └── courses/             # Uploaded handbook/topic files
│
└── fe/                          # Frontend (React SPA)
    ├── index.html
    ├── src/
    │   ├── main.jsx             # App entry, AuthProvider
    │   ├── App.jsx              # Root component
    │   ├── router/
    │   │   ├── Router.jsx       # Route definitions
    │   │   ├── PrivateRoute.jsx # Guards authenticated routes
    │   │   └── PublicRoute.jsx  # Guards login (redirects if already authed)
    │   ├── context/
    │   │   └── AuthContext.jsx  # Global auth state + login/logout
    │   ├── Layout/
    │   │   ├── Layout.jsx       # Shell: sidebar + topnav + outlet
    │   │   ├── Sidebar.jsx      # Navigation links + user info + logout
    │   │   └── TopNav.jsx       # Top bar
    │   ├── pages/               # Feature pages
    │   │   ├── Home.jsx         # Admin dashboard with stats cards
    │   │   ├── StudentHome.jsx  # Student-specific home
    │   │   ├── LoginForm.jsx
    │   │   ├── StudentList/Form.jsx
    │   │   ├── CourseList/Form.jsx
    │   │   ├── EventList/Form.jsx
    │   │   ├── InquiryList/Form.jsx
    │   │   ├── ProductList/Form.jsx
    │   │   ├── UserList/Form.jsx
    │   │   └── 404NotFound.jsx
    │   ├── services/            # Axios API calls per domain
    │   │   ├── api.js           # Axios instance (base URL + auth header)
    │   │   ├── authService.js
    │   │   ├── studentService.js
    │   │   ├── courseService.js
    │   │   ├── eventService.js
    │   │   ├── inquiryService.js
    │   │   ├── productService.js
    │   │   ├── userService.js
    │   │   ├── todoService.js
    │   │   └── dashboardService.js
    │   └── components/ui/       # Reusable Radix-based UI primitives
    │       ├── button.jsx
    │       ├── input.jsx
    │       ├── card.jsx
    │       ├── dialog.jsx
    │       ├── select.jsx
    │       ├── checkbox.jsx
    │       ├── textarea.jsx
    │       ├── label.jsx
    │       └── radio-group.jsx
```

---

## Architecture

```
Browser (React SPA)
      |
      | HTTP (Axios + Bearer token)
      v
Express REST API  (/api/*)
      |
      |-- JWT auth middleware (protect)
      |-- Role check middleware (authorize)
      |-- Validation middleware (express-validator)
      |
      v
Controllers  (business logic)
      |
      v
Mongoose Models
      |
      v
MongoDB Atlas / local MongoDB
```

All API responses follow a uniform envelope:
```json
{ "success": true, "message": "...", "data": { ... } }
```
Errors use the same shape with `"success": false` via the `ApiError` class and the global `errorHandler` middleware.

---

## Modules

### Dashboard
- Aggregates live counts: total students, total courses, upcoming events, new inquiries, total products, total users.
- Displayed as stat cards on the admin home page.

### Students
- Full CRUD for student records.
- Tracks: personal info, address, education history (qualification, stream, year), parent contact, tech/non-tech background.
- Statuses: `active`, `inactive`, `suspended`.
- Each student can be linked to a `User` account.

### Courses
- Manage course catalog with title, description, duration, and fees.
- File upload support for **handbook** and **topic sheet** (PDFs/documents via Multer).
- Statuses: `draft`, `active`, `inactive`.
- Tracks the user who created each course.

### Events
- Manage campus events: seminars, workshops, webinars, cultural events, sports.
- Fields: title, detail, host, coordinator, date, timing, place, location link.
- Statuses: `upcoming`, `ongoing`, `completed`, `cancelled`.

### Inquiries
- Captures prospect inquiries from website, reference, or social channels.
- Stores contact info, education background, interested area, and qualification.
- Can be assigned to a staff user for follow-up.
- Statuses: `new`, `contacted`, `resolved`, `closed`.

### Products / Inventory
- Tracks physical inventory items (e.g., lab equipment, stationery).
- Fields: `receiveCount`, `missing`, `availableCount`.
- Status auto-computed by a Mongoose pre-save hook:
  - `availableCount <= 0` → `out-of-stock`
  - `availableCount <= 10` → `low-stock`
  - otherwise → `in-stock`

### Users
- Internal staff accounts with roles: `admin`, `head`, `staff`, `student`.
- Full profile: name, email, DOB, gender, mobile, full address.
- Statuses: `active`, `inactive`.
- Passwords hashed with bcryptjs (salt rounds: 10) via a Mongoose pre-save hook.

### Todos
- Per-user task list with priority (`low`, `medium`, `high`) and category (`work`, `personal`, `study`).
- Statuses: `pending`, `completed`.
- Marked `important` flag for highlighting urgent tasks.

---

## Data Models

### User
```
firstName, lastName, email (unique), password (hashed),
dateOfBirth, gender, mobileNumber,
addressLine1, addressLine2, city, state, pincode,
role: admin | head | staff | student,
status: active | inactive
```

### Student
```
firstName, lastName, email (unique),
dateOfBirth, gender, mobileNumber,
address, landmark, city, state, pincode,
background: tech | non-tech,
educationList: [{ qualification, stream, year }],
parentName, parentPhone,
status: active | inactive | suspended,
user: ref → User
```

### Course
```
title, description, duration, fees,
handbook (file path), topicSheet (file path),
status: draft | active | inactive,
createdBy: ref → User
```

### Event
```
title, detail, host, coordinator, date, timing, place,
type: seminar | workshop | webinar | cultural | sports,
description, locationLink,
status: upcoming | ongoing | completed | cancelled,
createdBy: ref → User
```

### Inquiry
```
sourceOfInquiry: website | reference | social,
firstName, lastName, email, dateOfBirth, gender, mobile,
addressLine1, addressLine2, city, state, pincode,
techBackground: tech | non-tech,
qualification, specialization, passingYear, interestedArea,
assignTo: ref → User,
status: new | contacted | resolved | closed
```

### Product
```
productName, receiveCount, missing, availableCount,
description,
status: in-stock | low-stock | out-of-stock  (auto-computed)
```

### Todo
```
todo (text), important (bool), priority: low | medium | high,
category: work | personal | study,
status: pending | completed,
user: ref → User
```

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/logout` | Logout (clears session) |
| GET | `/api/auth/me` | Get current logged-in user |
| GET/POST | `/api/users` | List / create users |
| GET/PUT/DELETE | `/api/users/:id` | Get / update / delete user |
| GET/POST | `/api/students` | List / create students |
| GET/PUT/DELETE | `/api/students/:id` | Get / update / delete student |
| GET/POST | `/api/courses` | List / create courses |
| GET/PUT/DELETE | `/api/courses/:id` | Get / update / delete course |
| GET/POST | `/api/events` | List / create events |
| GET/PUT/DELETE | `/api/events/:id` | Get / update / delete event |
| GET/POST | `/api/inquiries` | List / create inquiries |
| GET/PUT/DELETE | `/api/inquiries/:id` | Get / update / delete inquiry |
| GET/POST | `/api/products` | List / create products |
| GET/PUT/DELETE | `/api/products/:id` | Get / update / delete product |
| GET/POST | `/api/todos` | List / create todos |
| GET/PUT/DELETE | `/api/todos/:id` | Get / update / delete todo |
| GET | `/api/dashboard` | Aggregated stats |
| GET | `/api/health` | Health check |
| GET | `/api-docs` | Swagger UI (interactive docs) |

> Static uploaded files served from `/uploads/*`.

---

## Authentication & Authorization

**Flow:**
1. Client sends `POST /api/auth/login` with email + password.
2. Server verifies credentials, checks account is `active`, and returns a signed JWT.
3. Client stores the token in `localStorage` and attaches it as `Authorization: Bearer <token>` on every subsequent request.
4. The `protect` middleware validates the JWT and loads the user on `req.user`.
5. The `authorize(...roles)` middleware checks `req.user.role` against the allowed roles for that route.

**Frontend:**
- `AuthContext` manages the `user` state and persists it to `localStorage`.
- `PrivateRoute` redirects unauthenticated users to `/login`.
- `PublicRoute` redirects already-authenticated users away from `/login`.
- Role-specific routing: `student` role lands on `/student-home`; other roles get the full admin layout.

**User Roles:**
| Role | Access |
|---|---|
| `admin` | Full access to all modules |
| `head` | Elevated staff access |
| `staff` | Standard operational access |
| `student` | Student home view only |

---

## Security

| Measure | Implementation |
|---|---|
| HTTP security headers | `helmet` middleware |
| Rate limiting | 100 requests per 15 minutes per IP via `express-rate-limit` |
| CORS | `cors` middleware |
| Password storage | bcryptjs with salt rounds = 10 |
| Token-based auth | JWT signed with secret from env |
| Input validation | `express-validator` rule sets per route |
| Error normalization | Custom `ApiError` + global `errorHandler` (no stack traces in production) |
| Inactive account blocking | Checked at login and on every protected request |

---

## Frontend Routing

```
/login                  Public only (redirects away if authenticated)

/student-home           Students only

/                       Dashboard (admin/head/staff)
/student                Student list
/student/create         Create student
/student/edit/:id       Edit student
/inquiry                Inquiry list
/inquiry/create         Create inquiry
/inquiry/edit/:id       Edit inquiry
/course                 Course list
/course/create          Create course
/course/edit/:id        Edit course
/event                  Event list
/event/create           Create event
/event/edit/:id         Edit event
/user                   User list
/user/create            Create user
/user/edit/:id          Edit user
/product                Product list
/product/create         Create product
/product/edit/:id       Edit product
*                       404 Not Found
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)

### Backend

```bash
cd be
npm install
cp .env.example .env   # fill in your values
npm run dev            # starts with nodemon on the configured port
```

To seed initial data:
```bash
npm run seed
```

### Frontend

```bash
cd fe
npm install
npm run dev            # Vite dev server at http://localhost:5173
```

---

## Environment Variables

### Backend (`be/.env`)
```
PORT=           # API server port (e.g. 5000)
MONGO_URI=      # MongoDB connection string
JWT_SECRET=     # Secret key for signing JWTs
JWT_EXPIRE=     # Token expiry (e.g. 7d)
NODE_ENV=       # development | production
```

### Frontend (`fe/.env`)
```
VITE_API_URL=   # Backend API base URL (e.g. http://localhost:5000)
```
