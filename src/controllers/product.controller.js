import Product from '../models/Product.js'

export const getProducts = async (req, res) => {
  try {
    const { search = '', category = '', color = '', minPrice, maxPrice, sort = 'newest', featured, page = 1, limit = 12 } = req.query
    const query = { isActive: true }
    if (search) query.$text = { $search: search }
    if (category) query.category = category
    if (color) query.colors = { $in: [color] }
    if (featured === 'true') query.featured = true
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }
    const sortMap = { newest: { createdAt: -1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, popular: { soldCount: -1 } }
    const skip = (Number(page) - 1) * Number(limit)
    const total = await Product.countDocuments(query)
    const products = await Product.find(query).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(Number(limit)).populate('category', 'name slug').lean()
    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    await product.populate('category', 'name slug')
    res.status(201).json(product)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('category', 'name slug')
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json(product)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) return res.status(404).json({ message: 'Produit introuvable' })
    res.json({ message: 'Produit supprimé' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
