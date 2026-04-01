import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const addressSchema = new mongoose.Schema({
  label: { type: String, default: 'Maison' },
  fullName: String, street: String, city: String,
  country: { type: String, default: 'Sénégal' }, phone: String,
  isDefault: { type: Boolean, default: false },
})

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, select: false },
  googleId:  String, avatar: String,
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  isVerified:{ type: Boolean, default: false },
  addresses: [addressSchema],
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password)
}

export default mongoose.model('User', userSchema)
