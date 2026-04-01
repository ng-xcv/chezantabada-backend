import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'fallback', { expiresIn: '30d' })
const userPublic = (u) => ({ id: u._id, firstName: u.firstName, lastName: u.lastName, email: u.email, role: u.role, avatar: u.avatar })

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) return res.status(400).json({ message: 'Tous les champs sont requis' })
    if (password.length < 6) return res.status(400).json({ message: 'Mot de passe trop court (6 min)' })
    if (await User.findOne({ email })) return res.status(409).json({ message: 'Email déjà utilisé' })
    const user = await User.create({ firstName, lastName, email, password })
    res.status(201).json({ token: signToken(user._id), user: userPublic(user) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' })
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
    }
    res.json({ token: signToken(user._id), user: userPublic(user) })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const googleCallback = (req, res) => {
  const token = signToken(req.user._id)
  res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.json(user)
  } catch (err) { res.status(500).json({ message: err.message }) }
}

export const updateMe = async (req, res) => {
  try {
    const { firstName, lastName, addresses } = req.body
    const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, addresses }, { new: true, runValidators: true })
    res.json(user)
  } catch (err) { res.status(400).json({ message: err.message }) }
}
