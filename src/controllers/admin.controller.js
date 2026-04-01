import Product from '../models/Product.js'
import Order from '../models/Order.js'
import User from '../models/User.js'

export const getStats = async (req, res) => {
  try {
    const [orders, products, users, lowStockProducts] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.find({ $expr: { $lte: ['$stock', '$lowStockAlert'] }, stock: { $gt: 0 } }).select('name stock').limit(10),
    ])
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['paid', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ])
    res.json({ orders, products, users, lowStock: lowStockProducts.length, lowStockProducts, revenue: revenue[0]?.total || 0 })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query
    const query = status ? { status } : {}
    const orders = await Order.find(query).sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit)).limit(Number(limit))
      .populate('user', 'firstName lastName email')
    res.json(orders)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']
    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Statut invalide' })
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, ...(status === 'delivered' ? { deliveredAt: new Date() } : {}) },
      { new: true }
    ).populate('user', 'firstName lastName email')
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
}
