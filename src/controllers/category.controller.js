import Category from '../models/Category.js'

export const getCategories = async (req, res) => {
  try {
    const cats = await Category.find({ isActive: true }).sort('order')
    res.json(cats)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body)
    res.status(201).json(cat)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!cat) return res.status(404).json({ message: 'Catégorie introuvable' })
    res.json(cat)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Catégorie supprimée' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
