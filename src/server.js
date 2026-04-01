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

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }))
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }))
app.use(express.json())
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/admin', adminRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'ChezAntaBada API v1.0' }))

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Erreur serveur' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`🚀 ChezAntaBada API on port ${PORT}`))
