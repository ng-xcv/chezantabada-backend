import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import passport from 'passport'

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import orderRoutes from './routes/orders.js'
import paymentRoutes from './routes/payment.js'
import adminRoutes from './routes/admin.js'
import { configurePassport } from './middleware/passport.js'

const app = express()
const PORT = process.env.PORT || 5000

// ─── Security ───
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

// ─── Rate limiting ───
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Trop de requêtes, réessayez plus tard.' },
})
app.use('/api/', limiter)

// ─── Body parsing ───
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── Passport ───
configurePassport(passport)
app.use(passport.initialize())

// ─── Routes ───
app.use('/api/auth',     authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders',   orderRoutes)
app.use('/api/payment',  paymentRoutes)
app.use('/api/admin',    adminRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ChezAntaBada API' }))

// ─── Error handler ───
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Erreur interne du serveur',
  })
})

// ─── DB + Start ───
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connecté')
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Erreur MongoDB:', err.message)
    process.exit(1)
  })

export default app
