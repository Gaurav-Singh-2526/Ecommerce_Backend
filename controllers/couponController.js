const Coupon = require('../models/Coupon');
const { asyncHandler } = require('../middleware/errorHandler');

// @route POST /api/coupons/validate  { code, subtotal }
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal = 0 } = req.body;
  const coupon = await Coupon.findOne({ code: code?.trim().toUpperCase(), active: true });

  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }
  if (subtotal < coupon.minOrder) {
    res.status(400);
    throw new Error(`Minimum order of ₹${coupon.minOrder.toLocaleString('en-IN')} required for this coupon`);
  }

  const rawDiscount = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value;
  const discount = Math.min(rawDiscount, coupon.maxDiscount);

  res.json({ code: coupon.code, discount, description: coupon.description });
});

// @route GET /api/coupons
const listCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ active: true });
  res.json(coupons);
});

module.exports = { validateCoupon, listCoupons };
