const Product = require('../models/Product');
const { asyncHandler } = require('../middleware/errorHandler');

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  rating: { rating: -1 },
  popularity: { reviewCount: -1 },
  newest: { createdAt: -1 },
};

const buildFilterQuery = (query) => {
  const filter = {};
  if (query.query) filter.$text = { $search: query.query };
  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = { $in: query.brand.split(',') };
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  if (query.minRating) filter.rating = { $gte: Number(query.minRating) };
  if (query.minDiscount) filter.discount = { $gte: Number(query.minDiscount) };
  if (query.inStock === '1') filter.inStock = true;
  return filter;
};

// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const filter = buildFilterQuery(req.query);
  const sort = SORT_MAP[req.query.sort] || {};

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort).skip((page - 1) * limit).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) });
});

// @route GET /api/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// @route GET /api/products/:id/related
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const related = await Product.find({ category: product.category, _id: { $ne: product._id } }).limit(
    Number(req.query.limit) || 6
  );
  res.json(related);
});

// @route GET /api/products/collections/:type
// type: featured | deals | best-sellers | new-arrivals | trending
const getCollection = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const { type } = req.params;

  let items;
  switch (type) {
    case 'featured':
      items = await Product.find().sort({ rating: -1 }).limit(limit);
      break;
    case 'deals':
      items = await Product.find({ discount: { $gte: 30 } }).sort({ discount: -1 }).limit(limit);
      break;
    case 'best-sellers':
      items = await Product.find().sort({ reviewCount: -1 }).limit(limit);
      break;
    case 'new-arrivals':
      items = await Product.find().sort({ createdAt: -1 }).limit(limit);
      break;
    case 'trending': {
      // Deterministic pseudo-shuffle so it differs from best-sellers/featured
      const all = await Product.find();
      items = all
        .map((p, i) => ({ p, key: (i * 2654435761) % 1000003 }))
        .sort((a, b) => b.key - a.key)
        .slice(0, limit)
        .map((x) => x.p);
      break;
    }
    default:
      res.status(400);
      throw new Error(`Unknown collection type: ${type}`);
  }

  res.json(items);
});

module.exports = { getProducts, getProductById, getRelatedProducts, getCollection };
