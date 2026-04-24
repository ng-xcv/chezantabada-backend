import Collection from '../models/Collection.js'

export const getCollections = async (req, res) => {
  try {
    const cols = await Collection.find({ isActive: true }).sort('order')
    res.json(cols)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const createCollection = async (req, res) => {
  try {
    const col = await Collection.create(req.body)
    res.status(201).json(col)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const updateCollection = async (req, res) => {
  try {
    const col = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!col) return res.status(404).json({ message: 'Collection introuvable' })
    res.json(col)
  } catch (err) { res.status(400).json({ message: err.message }) }
}

export const deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id)
    res.json({ message: 'Collection supprimée' })
  } catch (err) { res.status(500).json({ message: err.message }) }
}
