import { Router } from 'express'
import Stripe from 'stripe'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

// POST /api/payment/create-intent
router.post('/create-intent', requireAuth, async (req, res) => {
  try {
    const { items, address, total } = req.body

    if (!items?.length) return res.status(400).json({ message: 'Panier vide' })

    // Verify stock and build order items
    const orderItems = []
    let computedTotal = 0

    for (const item of items) {
      const product = await Product.findById(item._id)
      if (!product) return res.status(404).json({ message: `Produit ${item._id} introuvable` })
      if (product.stock < item.qty) {
        return res.status(400).json({ message: `Stock insuffisant pour "${product.name}"` })
      }
      orderItems.push({
        product: product._id,
        name:    product.name,
        image:   product.images?.[0],
        price:   product.price,
        qty:     item.qty,
      })
      computedTotal += product.price * item.qty
    }

    // Create order in DB
    const order = await Order.create({
      user:        req.user._id,
      items:       orderItems,
      address,
      totalAmount: computedTotal,
      status:      'pending',
    })

    // Create Stripe payment intent (amount in cents/smallest currency unit)
    const paymentIntent = await stripe.paymentIntents.create({
      amount:   Math.round(computedTotal * 100),
      currency: 'xof', // CFA Franc
      metadata: { orderId: order._id.toString(), userId: req.user._id.toString() },
    })

    // Store payment intent ID
    order.stripePaymentIntentId = paymentIntent.id
    await order.save()

    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/payment/confirm
router.post('/confirm', requireAuth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body

    const order = await Order.findOne({ _id: orderId, user: req.user._id })
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })

    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Paiement non confirmé' })
    }

    // Update order status
    order.status        = 'paid'
    order.paymentStatus = 'paid'
    await order.save()

    // Decrement stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty, sales: item.qty },
      })
    }

    res.json({ message: 'Commande confirmée', order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
