import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  oldPrice: Number, images: [String],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  colors: [String], material: String, dimensions: String,
  stock: { type: Number, default: 0, min: 0 },
  lowStockAlert: { type: Number, default: 5 },
  soldCount: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  tags: [String],
  seo: { metaTitle: String, metaDescription: String },
}, { timestamps: true, toJSON: { virtuals: true } })

productSchema.virtual('inStock').get(function () { return this.stock > 0 })
productSchema.virtual('lowStock').get(function () { return this.stock > 0 && this.stock <= this.lowStockAlert })

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase()
      .replace(/[àáâ]/g, 'a').replace(/[èéê]/g, 'e')
      .replace(/[ùúû]/g, 'u').replace(/\s+/g, '-').replace(/[^\w-]/g, '')
  }
  next()
})

productSchema.index({ name: 'text', description: 'text', tags: 'text' })
productSchema.index({ category: 1, price: 1 })
productSchema.index({ featured: 1 })

export default mongoose.model('Product', productSchema)
