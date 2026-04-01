import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: String, image: String, price: Number, qty: Number,
})

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  shippingAddress: { fullName: String, phone: String, street: String, city: String, country: String },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'stripe' },
  paymentIntentId: String,
  paidAt: Date, deliveredAt: Date, notes: String,
}, { timestamps: true })

export default mongoose.model('Order', orderSchema)
