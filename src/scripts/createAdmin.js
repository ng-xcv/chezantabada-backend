import mongoose from 'mongoose'
import 'dotenv/config'
import User from '../models/User.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ng:ng@cluster0.sypk7.mongodb.net/'

async function createAdmin() {
  await mongoose.connect(MONGODB_URI, { dbName: 'chezantabada' })
  console.log('✅ MongoDB connecté')

  const email = 'fayteksolution@gmail.com'
  const password = 'Faytek@2026!'

  const existing = await User.findOne({ email })
  if (existing) {
    // Update to admin + reset password
    existing.role = 'admin'
    existing.password = password
    await existing.save()
    console.log(`✅ Compte existant mis à jour en ADMIN : ${email}`)
  } else {
    const admin = new User({
      firstName: 'Faytek',
      lastName: 'Solution',
      email,
      password,
      role: 'admin',
    })
    await admin.save()
    console.log(`✅ Compte admin créé : ${email}`)
  }

  console.log(`📧 Email    : ${email}`)
  console.log(`🔑 Password : ${password}`)
  process.exit(0)
}

createAdmin().catch(err => {
  console.error('❌ Erreur:', err)
  process.exit(1)
})
