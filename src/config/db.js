import mongoose from 'mongoose'
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'chezantabada' })
    console.log('✅ MongoDB connecté — chezantabada')
  } catch (err) {
    console.error('❌ MongoDB erreur:', err.message)
    process.exit(1)
  }
}
