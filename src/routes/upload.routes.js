import { Router } from 'express'
import multer from 'multer'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import cloudinary from '../config/cloudinary.js'

const router = Router()

// Stockage en mémoire → envoi vers Cloudinary
const storage = multer.memoryStorage()
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Format non supporté. Utilisez JPG, PNG, WebP ou GIF.'))
    }
  },
})

// Upload un fichier vers Cloudinary
const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'chezantabada/products',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 1000, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    )
    stream.end(buffer)
  })
}

// POST /api/upload/image  — 1 fichier
router.post('/image', protect, adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier fourni' })
  try {
    const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype)
    res.json({
      url:          result.secure_url,
      publicId:     result.public_id,
      width:        result.width,
      height:       result.height,
      originalName: req.file.originalname,
    })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ message: 'Erreur upload Cloudinary', detail: err.message })
  }
})

// POST /api/upload/images  — plusieurs fichiers (max 10)
router.post('/images', protect, adminOnly, upload.array('images', 10), async (req, res) => {
  if (!req.files?.length) return res.status(400).json({ message: 'Aucun fichier fourni' })
  try {
    const results = await Promise.all(
      req.files.map(f => uploadToCloudinary(f.buffer, f.mimetype))
    )
    const urls = results.map(r => r.secure_url)
    res.json({ urls, count: urls.length })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ message: 'Erreur upload Cloudinary', detail: err.message })
  }
})

// DELETE /api/upload/image  — supprimer une image Cloudinary
router.delete('/image', protect, adminOnly, async (req, res) => {
  const { publicId } = req.body
  if (!publicId) return res.status(400).json({ message: 'publicId requis' })
  try {
    await cloudinary.uploader.destroy(publicId)
    res.json({ message: 'Image supprimée' })
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression', detail: err.message })
  }
})

export default router
