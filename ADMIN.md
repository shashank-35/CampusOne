# CampusOne — Admin Panel Documentation

## Overview

The admin panel is the staff-facing interface of CampusOne. It is accessible at `http://localhost:5173` and requires login at `/login`.

---

## Roles & Access

| Role | Description |
|------|-------------|
| `admin` | Full access to all modules including user management and deletions |
| `counselor` | Inquiries, admissions, payments (no delete, no user management) |
| `receptionist` | View + create for inquiries, admissions, payments, students |

> Only `admin` can create/edit/delete users. Students are never managed through this panel.

---

## Login

- **URL:** `/login`
- **Default admin credentials:**
  - Email: `admin@campusone.com`
  - Password: `admin123`

---

## Modules

### 1. Dashboard (`/`)

The home page. Displays real-time stats and charts.

**Stat cards:**
- Total Students
- Total Courses
- Upcoming Events
- New Inquiries (status: new)
- Today's Inquiries
- Total Admissions
- Admissions This Month
- Conversion Rate (admissions / total inquiries × 100%)
- Top Course (by admission count)
- Total Users (staff only, excludes students)

**Payment analytics (admin view):**
- Total Revenue collected
- This Month Revenue
- Pending Payments count
- Total Pending Amount

**Charts:**
- Monthly Inquiries bar chart (last 6 months)
- Inquiry Status breakdown pie chart
- Monthly Revenue bar chart (last 6 months)
- Payment Methods pie chart

---

### 2. Inquiries (`/inquiry`)

Manage student inquiries submitted via the public form or staff.

**Pages:**
| Path | Description |
|------|-------------|
| `/inquiry` | List all inquiries with search and status filter |
| `/inquiry/create` | Create a new inquiry manually |
| `/inquiry/edit/:id` | Edit an existing inquiry |

**Inquiry Statuses:**
`new` → `contacted` → `interested` → `not-interested` → `converted` → `admission-done`

**Actions available per inquiry:**
- Edit status, assign to counselor, add notes
- Convert to Student (creates a User account + Student record, sends welcome email)
- Convert to Admission (creates Admission record, updates inquiry to `admission-done`)

**API Endpoints:**
```
GET    /api/inquiries               — list with filters (status, search, assignedTo)
POST   /api/inquiries               — create inquiry
GET    /api/inquiries/:id           — get single inquiry
PUT    /api/inquiries/:id           — update inquiry
DELETE /api/inquiries/:id           — delete (admin / counselor only)
PUT    /api/inquiries/:id/assign    — assign to counselor (admin / receptionist)
POST   /api/inquiries/:id/notes     — add a note
POST   /api/inquiries/:id/convert   — convert to student
POST   /api/inquiries/:id/convert-admission — convert to admission (with document upload)
POST   /api/inquiries/public        — public form submission (no auth)
```

---

### 3. Admissions (`/admission`)

Manage student admissions. Admissions can be created manually or via inquiry conversion.

**Pages:**
| Path | Description |
|------|-------------|
| `/admission` | List admissions with status and payment filters |
| `/admission/create` | Create a new admission |
| `/admission/edit/:id` | Edit admission details and upload documents |
| `/admission/:id` | View admission detail |

**Admission Fields:**
- Student Name, Email, Mobile, Date of Birth, Gender
- Course (linked or manual text), Batch
- Total Fees, Discount → Final Fees (auto-computed: `totalFees - discount`)
- Payment Status (auto-synced from payments: `pending` / `partial` / `paid`)
- Status: `pending` / `approved` / `rejected`
- Documents: Photo (image), ID Proof (PDF/doc), Marksheet (PDF/doc)
- Notes, linked Inquiry, linked Student

**Role permissions:**
| Action | Admin | Counselor | Receptionist |
|--------|-------|-----------|--------------|
| View list / detail | Yes | Yes | Yes |
| Create | Yes | Yes | Yes |
| Edit | Yes | Yes | No |
| Delete | Yes | No | No |

**API Endpoints:**
```
GET    /api/admissions          — list (filters: status, paymentStatus, search)
POST   /api/admissions          — create (multipart/form-data for documents)
GET    /api/admissions/:id      — get single
PUT    /api/admissions/:id      — update (multipart/form-data)
DELETE /api/admissions/:id      — delete (admin only)
```

---

### 4. Payments (`/payment`)

Track fee payments per student/admission.

**Pages:**
| Path | Description |
|------|-------------|
| `/payment` | List payments with search, status, method filters |
| `/payment/create` | Record a new payment |
| `/payment/edit/:id` | Edit payment record |
| `/payment/:id` | View payment detail + download receipt |

**Payment Fields:**
- Link to Admission (auto-fills student name, course, email, fees)
- Student Name, Course Name, Email, Mobile
- Total Fees, Amount Paid → Remaining Amount (auto-computed)
- Payment Method: `cash` / `upi` / `card` / `bank`
- Payment Date, Transaction ID / Reference
- Status (auto-derived): `pending` / `partial` / `paid`
- Receipt Number (auto-generated: `RCP-YYYY-000001`)
- Notes

**Live fee preview:**
When entering Total Fees and Amount Paid in the form, a summary card shows the remaining amount and auto-status badge in real time.

**PDF Receipt:**
Every payment has a downloadable PDF receipt available from both the list view and the detail page.

**Role permissions:**
| Action | Admin | Counselor | Receptionist |
|--------|-------|-----------|--------------|
| View list / detail | Yes | Yes | Yes |
| Create | Yes | Yes | Yes |
| Edit | Yes | Yes | No |
| Delete | Yes | No | No |
| Download receipt | Yes | Yes | Yes |

**API Endpoints:**
```
GET    /api/payments              — list (filters: status, paymentMethod, search)
POST   /api/payments              — create payment
GET    /api/payments/:id          — get single
PUT    /api/payments/:id          — update
DELETE /api/payments/:id          — delete (admin only)
GET    /api/payments/:id/receipt  — download PDF receipt
```

---

### 5. Students (`/student`)

Manage enrolled student records.

**Pages:**
| Path | Description |
|------|-------------|
| `/student` | List all students |
| `/student/create` | Add a new student |
| `/student/edit/:id` | Edit student record |

**Role permissions:** Admin and receptionist can create/edit. Admin only can delete.

**API Endpoints:**
```
GET    /api/students
POST   /api/students
GET    /api/students/:id
PUT    /api/students/:id
DELETE /api/students/:id    — admin only
```

---

### 6. Courses (`/course`)

Manage available courses offered by the institution.

**Pages:** `/course`, `/course/create`, `/course/edit/:id`

**API Endpoints:**
```
GET    /api/courses
POST   /api/courses
GET    /api/courses/:id
PUT    /api/courses/:id
DELETE /api/courses/:id
```

---

### 7. Events (`/event`)

Manage campus events (seminars, workshops, webinars, etc.).

**Pages:** `/event`, `/event/create`, `/event/edit/:id`

**API Endpoints:**
```
GET    /api/events
POST   /api/events
GET    /api/events/:id
PUT    /api/events/:id
DELETE /api/events/:id
```

---

### 8. Products (`/product`)

Manage products or merchandise sold by the institution.

**Pages:** `/product`, `/product/create`, `/product/edit/:id`

**API Endpoints:**
```
GET    /api/products
POST   /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

---

### 9. Users (`/user`)

Manage staff accounts. **Admin only.**

**Pages:** `/user`, `/user/create`, `/user/edit/:id`

**Available roles when creating a user:** `admin`, `counselor`, `receptionist`
> Students are not created here. They are auto-created via inquiry conversion.

**API Endpoints:**
```
GET    /api/users         — admin only
POST   /api/users         — admin only
GET    /api/users/:id     — admin only
PUT    /api/users/:id     — admin only
DELETE /api/users/:id     — admin only
```

---

### 10. Activity Log (`/activity-log`)

View a chronological log of all staff actions (create, update, delete, assign, convert). **Admin only.**

**API Endpoint:**
```
GET    /api/activity-logs     — admin only (filterable by action, entity, user)
```

---

### 11. QR Code (`/qr-code`)

Generate a QR code that links to the public inquiry form. Share with prospective students. **Admin only.**

**API Endpoint:**
```
GET    /api/qr/inquiry-form   — returns QR code image
```

---

### 12. My Profile (`/profile`)

Any logged-in staff member can view and edit their own profile, change their password, and update their profile picture.

**API Endpoints:**
```
GET    /api/profile
PUT    /api/profile
PUT    /api/profile/password
PUT    /api/profile/image
```

---

## Sidebar Navigation by Role

| Menu Item | Admin | Counselor | Receptionist |
|-----------|-------|-----------|--------------|
| Dashboard | Yes | Yes | Yes |
| Inquiries | Yes | Yes | Yes |
| Admissions | Yes | Yes | Yes |
| Payments | Yes | Yes | Yes |
| Students | Yes | No | Yes |
| Courses | Yes | No | No |
| Events | Yes | No | No |
| Products | Yes | No | No |
| Users | Yes | No | No |
| QR Code | Yes | No | No |
| Activity Log | Yes | No | No |
| My Profile | Yes | Yes | Yes |

---

## Public Inquiry Form

- **URL:** `/inquiry-form`
- No login required — accessed via QR code or direct link
- Submitted inquiries appear in the Inquiries list with status `new`
- **API:** `POST /api/inquiries/public`

---

## Notifications

Staff receive in-app notifications (polled every 30 seconds) for events like new inquiries, inquiry assignments, and admissions.

**API Endpoints:**
```
GET    /api/notifications
PUT    /api/notifications/:id       — mark as read
DELETE /api/notifications/:id
```

---

## Dashboard API Reference

```
GET /api/dashboard/stats              — main stat counts
GET /api/dashboard/monthly-inquiries  — last 6 months inquiry count
GET /api/dashboard/inquiry-status     — inquiry status breakdown
GET /api/dashboard/recent-inquiries   — latest 10 inquiries
GET /api/dashboard/payment-stats      — revenue, pending, method breakdown
GET /api/dashboard/monthly-revenue    — last 6 months revenue
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js, Express 5, MongoDB, Mongoose |
| Auth | JWT (stored in `localStorage` as `token`) |
| File uploads | Multer (`/uploads/` directory) |
| PDF generation | PDFKit (streamed directly, no temp files) |
| Frontend | React 19, Vite, TailwindCSS v4 |
| Forms | React Hook Form |
| Charts | Recharts (BarChart, PieChart) |
| Notifications | Toast via react-hot-toast |

---

## Running the Project

```bash
# Install dependencies
cd be && npm install
cd fe && npm install

# Seed demo accounts
cd be && npm run seed

# Start both servers
cd be && npm run dev     # http://localhost:5000
cd fe && npm run dev     # http://localhost:5173
```

**Demo credentials after seeding:**

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@campusone.com | admin123 |
| Counselor | counselor@campusone.com | counselor123 |
| Receptionist | receptionist@campusone.com | reception123 |
