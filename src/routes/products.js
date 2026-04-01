import { Router } from 'express'
import Product from '../models/Product.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      search, category, color, featured,
      minPrice, maxPrice, sort = 'newest',
      page = 1, limit = 12,
    } = req.query

    const query = {}

    if (search) query.$text = { $search: search }
    if (category) query.category = category
    if (color) query.colors = color
    if (featured === 'true') query.featured = true
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const sortMap = {
      newest:     { createdAt: -1 },
      price_asc:  { price: 1 },
      price_desc: { price: -1 },
      popular:    { sales: -1 },
    }

    const skip  = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)

    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    res.json({
      products,
      total,
      page:       Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/products (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    await product.populate('category', 'name slug')
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT /api/products/:id (admin)
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/products/:id (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ message: 'Produit supprimé' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
