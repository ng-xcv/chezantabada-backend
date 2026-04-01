import { Router } from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import User from '../models/User.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/admin/stats
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const [orders, products, users, lowStockProducts] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.find({ stock: { $lte: 5 } }).select('name stock').limit(10),
    ])

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])

    res.json({
      orders,
      products,
      users,
      lowStock: lowStockProducts.length,
      lowStockProducts,
      revenue: revenue[0]?.total || 0,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/orders
router.get('/orders', requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(100)
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// PUT /api/admin/orders/:id
router.put('/orders/:id', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'firstName lastName email')
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/admin/users
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
