import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, select: false },
  role:      { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId:  { type: String },
  avatar:    { type: String },
  phone:     { type: String },
  addresses: [{
    fullName: String,
    street:   String,
    city:     String,
    country:  { type: String, default: 'Sénégal' },
    phone:    String,
    isDefault: { type: Boolean, default: false },
  }],
}, { timestamps: true })

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
