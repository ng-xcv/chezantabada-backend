import { Router } from 'express'
import { getStats, getAllOrders, updateOrderStatus } from '../controllers/admin.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
const router = Router()
router.use(protect, adminOnly)
router.get('/stats', getStats)
router.get('/orders', getAllOrders)
router.put('/orders/:id', updateOrderStatus)
export default router
