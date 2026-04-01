import { Router } from 'express'
import passport from 'passport'
import { register, login, googleCallback, getMe, updateMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.middleware.js'
const router = Router()
router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/connexion' }), googleCallback)
export default router
