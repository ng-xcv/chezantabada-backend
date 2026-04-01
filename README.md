# ChezAntaBada — Backend API

REST API pour ChezAntaBada e-commerce. Node.js + Express + MongoDB.

## Installation

```bash
npm install
cp .env.example .env
npm run dev
```

## Routes

- `POST /api/auth/register` — Inscription
- `POST /api/auth/login` — Connexion
- `GET  /api/auth/me` — Profil (auth)
- `GET  /api/products` — Liste produits
- `GET  /api/categories` — Liste catégories
- `POST /api/payment/create-intent` — Créer paiement Stripe
- `GET  /api/admin/stats` — Stats admin
- `GET  /api/health` — Health check
