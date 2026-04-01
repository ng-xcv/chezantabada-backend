import { Router } from 'express'
import { createPaymentIntent, confirmOrder, stripeWebhook } from '../controllers/payment.controller.js'
import { protect } from '../middleware/auth.middleware.js'
const router = Router()
router.post('/create-intent', protect, createPaymentIntent)
router.post('/confirm', protect, confirmOrder)
router.post('/webhook', stripeWebhook)
export default router
