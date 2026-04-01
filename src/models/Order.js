import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  image:    String,
  price:    Number,
  qty:      Number,
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  address: {
    fullName: String,
    phone:    String,
    street:   String,
    city:     String,
    country:  { type: String, default: 'Sénégal' },
  },
  totalAmount:       { type: Number, required: true },
  status:            { type: String, enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  stripePaymentIntentId: { type: String },
  paymentStatus:     { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
