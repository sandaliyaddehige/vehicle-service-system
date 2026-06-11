# FUCHSIUS - Vehicle Service Booking System (MERN Stack)

A comprehensive, full-stack digital booking platform built using the MERN architecture. This system eliminates manual appointment hassle at vehicle service centers by streamlining the booking process for customers and providing a robust management dashboard for administrators.

Designed and developed as a collaborative final project within a 1-month internship duration.

---

## 🚀 Features

### For Customers
*   **Online Booking Form:** Easily book service appointments by providing name, contact info, vehicle number, service type, preferred date, and time.
*   **Booking Confirmation:** View instant confirmation details after submitting a request.

### For Administrators
*   **Secure Authentication:** Dedicated admin login using JWT and Bcrypt encryption.
*   **Interactive Dashboard:** Real-time summary statistics including *Total Bookings*, *Pending Approvals*, *Approved*, and *Completed Services*.
*   **Booking Management:** Complete control to approve, reject, or mark bookings as completed.
*   **Service Category Management:** Dynamically add and manage different service types (e.g., Oil Change, Full Service).
*   **Filters:** Ability to filter bookings by date or status for streamlined workflow tracking.

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS (or standard CSS), Axios, React Router
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (Mongoose ODM)
*   **Security:** JSON Web Tokens (JWT) & Bcrypt for password hashing
*   **Deployment:** Frontend hosted on **Vercel** / Backend hosted on **Railway**

---

## 📁 Structure
- backend/   → API Server        (Port 5000)
- frontend/  → Customer Website  (Port 3000)
- admin/     → Admin Panel       (Port 3001)

## ⚙️ MongoDB Setup
backend/.env file edit:
MONGO_URI=mongodb+srv://vehicle:Vehicle123@cluster0.XXXXXXX.mongodb.net/fuchsius?retryWrites=true&w=majority
(cluster0.XXXXXXX.mongodb.net →   replace your Atlas URL )

## 🚀 Run

Terminal 1 - Backend:
  cd backend && npm install && npm run dev

Terminal 2 - Seed data (once):
  cd backend && node seed.js

Terminal 3 - Customer site:
  cd frontend && npm install && npm start

Terminal 4 - Admin panel:
  cd admin && npm install && npm start

## 🌐 URLs
Customer: http://localhost:3000
Admin:    http://localhost:3001
API:      http://localhost:5000/api

## 🔐 Admin Login
Email:    admin@fuchsius.lk
Password: admin123


## 📂 Project Folder Structure

```text
vehicle-service-app/
├── backend/
│   ├── config/          # Database connection settings
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & error middlewares
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints definitions
│   └── server.js        # Backend entry point
└── frontend/
    └── src/
        ├── api/         # Axios configurations
        ├── components/  # Reusable UI elements
        ├── context/     # State management
        ├── pages/       # Dashboard, Booking, and Login pages
        └── App.js       # Frontend entry point
