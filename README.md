# Vendor Management Portal

A full-stack vendor management system built using **Next.js (App Router)** for the frontend, **Node.js + Express** for the backend, and **Supabase PostgreSQL** as the database.

This project implements real-world vendor workflows including registration, authentication, vendor dashboards, product management, reviews, ratings, and a public admin panel.

---

## 🚀 Features

### ✅ Public Features
- View all vendors
- Vendor detail page with products and reviews
- Submit feedback & ratings
- Public admin view of all vendors (no login required)

### 🔐 Vendor Features (Dashboard)
- Login using JWT authentication
- Edit vendor profile
- Add / edit / delete products
- View own products
- Seamless real-time UI updates

### 🛠 Backend Features
- Secure JWT authentication
- Full CRUD product management
- Vendor profile management
- Public vendor listing with rating aggregation
- Admin endpoint exposing vendor stats

---

## 🏗 Tech Stack

### **Frontend**
- Next.js (App Router)
- React
- Tailwind CSS
- TypeScript

### **Backend**
- Node.js + Express
- PostgreSQL (Supabase)
- JWT Authentication
- CORS-enabled API

---

## 📂 Folder Structure

```
vendor-portal/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── server.js
│   ├── package.json
│
└── frontend/
    ├── app/
    │   ├── vendor/
    │   ├── dashboard/
    │   ├── admin/vendors/
    ├── lib/
    ├── package.json
```

---

## 🔑 Environment Variables

### Backend `.env`

```
DATABASE_URL="your_supabase_postgres_url"
JWT_SECRET="your_secret_key"
PORT=5000
```

### Frontend `.env.local`

(Not required unless deploying with external API base URLs)

---

## 📌 API Documentation

### **Auth**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | /api/auth/register | Register vendor |
| POST | /api/auth/login | Login vendor |
| GET | /api/vendor/profile | Get vendor profile |
| PUT | /api/vendor/profile | Update vendor profile |

### **Products**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/vendor/products | Get vendor products |
| POST | /api/vendor/products | Add a new product |
| GET | /api/vendor/products/:id | Get a single product |
| PUT | /api/vendor/products/:id | Update product |
| DELETE | /api/vendor/products/:id | Delete product |

### **Public**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| GET | /api/public/vendors | Public vendor list |
| GET | /api/public/vendor/:id | Vendor detail page data |
| POST | /api/public/vendor/:id/reviews | Submit review |
| GET | /api/public/vendors-with-stats | Admin vendor overview |

---

## 🧪 Running the Project Locally

### Backend

```
cd backend
npm install
npm run dev
```

### Frontend

```
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Guide

### Frontend (Vercel)
1. Connect GitHub repo
2. Select frontend folder
3. Deploy

### Backend (Railway)
1. New Service → Deploy from repo
2. Set environment variables
3. Deploy backend
4. Update frontend `BASE_URL`

---

## 🏁 Final Notes

This project was built with:
- Clean architecture
- Fully typed frontend
- Protected dashboard routes
- Production-ready API structure

Perfect for interview submissions & portfolio projects.
