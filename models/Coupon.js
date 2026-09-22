const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  type: { type: String, enum: ['percent', 'flat'], required: true },
  value: { type: Number, required: true },
  maxDiscount: { type: Number, required: true },
  minOrder: { type: Number, default: 0 },
  description: { type: String, default: '' },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model('Coupon', couponSchema);
