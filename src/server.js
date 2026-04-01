import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import passport from 'passport'
import { connectDB } from './config/db.js'
import './config/passport.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import categoryRoutes from './routes/category.routes.js'
import orderRoutes from './routes/order.routes.js'
import paymentRoutes from './routes/payment.routes.js'
import adminRoutes from './routes/admin.routes.js'
import 'dotenv/config'

const app = express()
connectDB()

// CORS — doit être AVANT tout le reste
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://chezantabada-frontend.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    // Autoriser les requêtes sans origin (Postman, mobile) et les origines connues
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS non autorisé pour: ${origin}`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

// Gérer les requêtes OPTIONS preflight explicitement
app.options('*', cors(corsOptions))

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))

// Stripe webhook needs raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_, res) => res.json({
  status: 'ok',
  app: 'ChezAntaBada API v1.0',
  cors: 'enabled',
  allowedOrigins,
}))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 ChezAntaBada API on port ${PORT}`))

export default app
