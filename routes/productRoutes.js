const express = require('express');
const { getProducts, getProductById, getRelatedProducts, getCollection } = require('../controllers/productController');
const { getReviewsForProduct, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/collections/:type', getCollection);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);
router.get('/:id/reviews', getReviewsForProduct);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
