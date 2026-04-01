import { Router } from 'express'
import Category from '../models/Category.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()

// GET /api/categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 })
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/categories (admin)
router.post('/', requireAdmin, async (req, res) => {
  try {
    const category = await Category.create(req.body)
    res.status(201).json(category)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE /api/categories/:id (admin)
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Catégorie supprimée' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
