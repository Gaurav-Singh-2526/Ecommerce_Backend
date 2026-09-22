const Review = require('../models/Review');
const { asyncHandler } = require('../middleware/errorHandler');

// @route GET /api/products/:id/reviews
const getReviewsForProduct = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.id }).sort({ createdAt: -1 });
  res.json(reviews);
});

// @route POST /api/products/:id/reviews  (protected)
const addReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  if (!rating || !comment) {
    res.status(400);
    throw new Error('Rating and comment are required');
  }

  const review = await Review.create({
    product: req.params.id,
    user: req.user._id,
    author: req.user.name,
    rating,
    title,
    comment,
    verified: false,
  });

  res.status(201).json(review);
});

module.exports = { getReviewsForProduct, addReview };
