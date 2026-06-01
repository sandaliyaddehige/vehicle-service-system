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
*   **Deployment:** Frontend hosted on **Vercel** / Backend hosted on **Render**

---

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
