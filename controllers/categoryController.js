const { CATEGORIES } = require('../utils/categories');
const { asyncHandler } = require('../middleware/errorHandler');

// @route GET /api/categories
const getCategories = asyncHandler(async (req, res) => {
  res.json(CATEGORIES);
});

// @route GET /api/categories/:slug
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = CATEGORIES.find((c) => c.slug === req.params.slug);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.json(category);
});

module.exports = { getCategories, getCategoryBySlug };
