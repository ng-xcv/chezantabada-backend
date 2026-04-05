import { Router } from 'express'
import multer from 'multer'
import { protect, adminOnly } from '../middleware/auth.middleware.js'

const router = Router()

// Stockage en mémoire → base64
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.'))
    }
  },
})

// POST /api/upload/image  (admin uniquement)
router.post('/image', protect, adminOnly, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni' })

  const base64 = req.file.buffer.toString('base64')
  const dataUrl = `data:${req.file.mimetype};base64,${base64}`

  res.json({
    url: dataUrl,
    mimetype: req.file.mimetype,
    size: req.file.size,
    originalName: req.file.originalname,
  })
})

// POST /api/upload/images  (plusieurs à la fois, max 10)
router.post('/images', protect, adminOnly, upload.array('images', 10), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'Aucun fichier fourni' })

  const urls = req.files.map(f => `data:${f.mimetype};base64,${f.buffer.toString('base64')}`)
  res.json({ urls })
})

export default router
