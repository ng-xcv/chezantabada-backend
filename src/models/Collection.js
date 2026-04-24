import mongoose from 'mongoose'
import slugify from 'slugify'

const collectionSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true },
  description: { type: String },
  image:       { type: String },
  tag:         { type: String, enum: ['', 'Bestseller', 'Nouveau', 'Limité'], default: '' },
  order:       { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
}, { timestamps: true })

collectionSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true })
  }
  next()
})

export default mongoose.model('Collection', collectionSchema)
