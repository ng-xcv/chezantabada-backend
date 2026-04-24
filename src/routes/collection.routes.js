import { Router } from 'express'
import { getCollections, createCollection, updateCollection, deleteCollection } from '../controllers/collection.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
const router = Router()
router.get('/', getCollections)
router.post('/', protect, adminOnly, createCollection)
router.put('/:id', protect, adminOnly, updateCollection)
router.delete('/:id', protect, adminOnly, deleteCollection)
export default router
