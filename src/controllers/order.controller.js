import Order from '../models/Order.js'

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 }).populate('items.product', 'name images')
    res.json(orders)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product')
    if (!order) return res.status(404).json({ message: 'Commande introuvable' })
    res.json(order)
  } catch (err) { res.status(500).json({ message: err.message }) }
}
