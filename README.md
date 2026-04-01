# ChezAntaBada — Backend API

REST API pour le e-commerce ChezAntaBada. Node.js + Express + MongoDB.

## Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT + Passport (Google OAuth)
- Stripe
- Joi validation

## Installation

```bash
npm install
cp .env.example .env
# Remplir les variables dans .env
npm run dev
```

## Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me
- GET  /api/auth/google
- GET  /api/products
- GET  /api/products/:id
- POST /api/payment/create-intent
- POST /api/payment/confirm
- GET  /api/admin/stats
- GET  /api/admin/orders
- PUT  /api/admin/orders/:id
