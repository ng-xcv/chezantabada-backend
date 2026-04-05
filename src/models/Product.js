import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String },
  price:       { type: Number, required: true, min: 0 },
  oldPrice:    { type: Number },
  category:    { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images:      [{ type: String }],
  colors:      [{ type: String }],
  material:    { type: String },
  dimensions:  { type: String },
  stock:       { type: Number, required: true, default: 0, min: 0 },
  featured:    { type: Boolean, default: false },
  isNew:       { type: Boolean, default: true },
  isActive:    { type: Boolean, default: true },
  lowStockAlert: { type: Number, default: 5 },
  tags:        [{ type: String }],
  seo: {
    metaTitle:       { type: String },
    metaDescription: { type: String },
  },
  sales:       { type: Number, default: 0 },
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ category: 1, price: 1 })
productSchema.index({ featured: 1 })

export default mongoose.model('Product', productSchema)
