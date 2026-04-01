import Stripe from 'stripe'
import Order from '../models/Order.js'
import Product from '../models/Product.js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

export const createPaymentIntent = async (req, res) => {
  try {
    const { items, address } = req.body
    if (!items?.length) return res.status(400).json({ message: 'Panier vide' })
    let total = 0
    const orderItems = []
    for (const item of items) {
      const product = await Product.findById(item._id)
      if (!product) return res.status(404).json({ message: `Produit introuvable: ${item._id}` })
      if (product.stock < item.qty) return res.status(400).json({ message: `Stock insuffisant: ${product.name}` })
      total += product.price * item.qty
      orderItems.push({ product: product._id, name: product.name, image: product.images[0] || '', price: product.price, qty: item.qty })
    }
    const order = await Order.create({ user: req.user._id, items: orderItems, shippingAddress: address, totalAmount: total })
    const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(total), currency: 'xof', metadata: { orderId: order._id.toString() } })
    res.json({ clientSecret: paymentIntent.client_secret, orderId: order._id })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const confirmOrder = async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body
    const order = await Order.findByIdAndUpdate(orderId, { status: 'paid', paymentIntentId, paidAt: new Date() }, { new: true })
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty, soldCount: item.qty } })
    }
    res.json({ order })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }
  if (event.type === 'payment_intent.succeeded') {
    const { orderId } = event.data.object.metadata
    if (orderId) await Order.findByIdAndUpdate(orderId, { status: 'paid', paidAt: new Date() })
  }
  res.json({ received: true })
}
