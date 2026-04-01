import { Router } from 'express'
import passport from 'passport'
import Joi from 'joi'
import User from '../models/User.js'
import { requireAuth } from '../middleware/auth.js'
import { signToken, formatUser } from '../utils/jwt.js'

const router = Router()

const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName:  Joi.string().min(2).max(50).required(),
  email:     Joi.string().email().required(),
  password:  Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required(),
})

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    const exists = await User.findOne({ email: value.email })
    if (exists) return res.status(409).json({ message: 'Un compte existe déjà avec cet email' })

    const user  = await User.create(value)
    const token = signToken(user._id)
    res.status(201).json({ user: formatUser(user), token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message })

    const user = await User.findOne({ email: value.email }).select('+password')
    if (!user || !user.password) return res.status(401).json({ message: 'Identifiants incorrects' })

    const isMatch = await user.comparePassword(value.password)
    if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' })

    const token = signToken(user._id)
    res.json({ user: formatUser(user), token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json(formatUser(req.user))
})

// PUT /api/auth/me
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    )
    res.json(formatUser(user))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET /api/auth/google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
)

// GET /api/auth/google/callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/connexion?error=google` }),
  (req, res) => {
    const token = signToken(req.user._id)
    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`)
  }
)

export default router
