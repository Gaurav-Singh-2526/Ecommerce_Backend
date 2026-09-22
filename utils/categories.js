/**
 * Static category reference data — mirrors src/utils/constants.js on the frontend.
 */
const CATEGORIES = [
  { id: 'electronics', name: 'Electronics', icon: '💻', slug: 'electronics' },
  { id: 'fashion', name: 'Fashion', icon: '👗', slug: 'fashion' },
  { id: 'mobiles', name: 'Mobiles', icon: '📱', slug: 'mobiles' },
  { id: 'home', name: 'Home & Furniture', icon: '🛋️', slug: 'home-furniture' },
  { id: 'appliances', name: 'Appliances', icon: '🧺', slug: 'appliances' },
  { id: 'beauty', name: 'Beauty & Toys', icon: '💄', slug: 'beauty-toys' },
  { id: 'grocery', name: 'Grocery', icon: '🛒', slug: 'grocery' },
  { id: 'sports', name: 'Sports & Fitness', icon: '🏋️', slug: 'sports-fitness' },
  { id: 'books', name: 'Books', icon: '📚', slug: 'books' },
  { id: 'automotive', name: 'Automotive', icon: '🚗', slug: 'automotive' },
];

const TOP_BRANDS = ['Samsung', 'Apple', 'Sony', 'Nike', 'Adidas', 'LG', 'boAt', 'Puma', 'OnePlus', 'HP'];

module.exports = { CATEGORIES, TOP_BRANDS };
