const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorHandler');

// @route POST /api/orders  (protected)
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod, subtotal, discount, deliveryFee, total } = req.body;

  if (!items?.length) {
    res.status(400);
    throw new Error('Order must contain at least one item');
  }

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    subtotal,
    discount,
    deliveryFee,
    total,
    status: 'placed',
    trackingHistory: [{ status: 'placed', note: 'Order placed successfully' }],
  });

  res.status(201).json(order);
});

// @route GET /api/orders  (protected) — current user's orders
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route GET /api/orders/:id  (protected)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

module.exports = { createOrder, getMyOrders, getOrderById };
