/**
 * Seeds MongoDB with the same deterministic product catalog the frontend
 * used as mock data, plus a starter coupon set. Run with `npm run seed`.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const { CATEGORIES, TOP_BRANDS } = require('./categories');

const ADJECTIVES = ['Pro', 'Max', 'Ultra', 'Lite', 'Plus', 'Air', 'Neo', 'Edge', 'Prime', 'X'];
const NOUNS = {
  electronics: ['Laptop', 'Headphones', 'Smartwatch', 'Camera', 'Speaker', 'Monitor', 'Tablet', 'Earbuds'],
  fashion: ['T-Shirt', 'Jacket', 'Sneakers', 'Jeans', 'Dress', 'Hoodie', 'Sandals', 'Cap'],
  mobiles: ['Smartphone', 'Phone Case', 'Charger', 'Power Bank', 'Screen Guard', 'Mobile Stand'],
  'home-furniture': ['Sofa', 'Study Table', 'Bookshelf', 'Bed Frame', 'Dining Set', 'Recliner'],
  appliances: ['Refrigerator', 'Washing Machine', 'Microwave', 'Air Conditioner', 'Mixer Grinder'],
  'beauty-toys': ['Face Serum', 'Lipstick', 'Action Figure', 'Puzzle Set', 'Perfume', 'Hair Dryer'],
  grocery: ['Organic Rice', 'Cold Press Oil', 'Green Tea', 'Almonds Pack', 'Honey Jar'],
  'sports-fitness': ['Yoga Mat', 'Dumbbell Set', 'Cricket Bat', 'Running Shoes', 'Cycling Helmet'],
  books: ['Novel', 'Cookbook', 'Biography', 'Self-Help Guide', 'Comic Collection'],
  automotive: ['Car Vacuum', 'Dash Cam', 'Tyre Inflator', 'Seat Cover Set', 'Car Perfume'],
};

const REVIEWERS = ['Aditi R.', 'Vikram S.', 'Neha P.', 'Arjun K.', 'Simran G.', 'Rahul M.', 'Divya T.', 'Sahil J.'];
const TITLES_BY_RATING = {
  5: ['Excellent purchase!', 'Worth every rupee', 'Exceeded expectations'],
  4: ['Pretty good', 'Happy with it', 'Good value for money'],
  3: ['Decent, does the job', 'Average experience', 'Okay-ish'],
  2: ['Could be better', 'Not fully satisfied', 'Had some issues'],
  1: ['Disappointed', 'Would not recommend', 'Not as described'],
};
const COMMENTS = [
  'The build quality feels premium and it works exactly as advertised.',
  'Delivery was quick and packaging was secure. Very satisfied overall.',
  'Does what it says, though I expected slightly better performance for the price.',
  'Had to contact support once but they resolved it quickly.',
  'Using it daily for a few weeks now and it holds up well.',
  'Great as a gift — the recipient loved it.',
  'Matches the photos and description accurately.',
  'A bit pricier than alternatives but the quality justifies it.',
];

const seededRandom = (seed) => {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const buildProducts = () => {
  const products = [];
  let id = 1;

  CATEGORIES.forEach((cat) => {
    const nouns = NOUNS[cat.slug] || ['Item'];
    nouns.forEach((noun) => {
      for (let variant = 0; variant < 3; variant++) {
        const rand = seededRandom(id * 97 + variant);
        const brand = TOP_BRANDS[Math.floor(rand() * TOP_BRANDS.length)];
        const adjective = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
        const basePrice = Math.round((rand() * 45000 + 499) / 10) * 10;
        const hasDiscount = rand() > 0.3;
        const discountPct = hasDiscount ? Math.floor(rand() * 50 + 10) : 0;
        const originalPrice = hasDiscount ? Math.round(basePrice / (1 - discountPct / 100)) : basePrice;
        const rating = +(rand() * 2.2 + 2.8).toFixed(1);
        const reviewCount = Math.floor(rand() * 8000 + 12);
        const seedKey = `${cat.id}${id}`;

        products.push({
          name: `${brand} ${adjective} ${noun}`,
          brand,
          category: cat.id,
          categoryName: cat.name,
          categorySlug: cat.slug,
          image: `https://picsum.photos/seed/${seedKey}/500/500`,
          gallery: [0, 1, 2, 3].map((g) => `https://picsum.photos/seed/${seedKey}-${g}/600/600`),
          price: basePrice,
          originalPrice,
          discount: discountPct,
          rating,
          reviewCount,
          isNew: rand() > 0.85,
          inStock: rand() > 0.08,
          description: `Experience the ${adjective.toLowerCase()} edition of the ${noun.toLowerCase()} from ${brand}, engineered for everyday performance with a design that stands out.`,
          specifications: {
            Brand: brand,
            Model: `${adjective}-${1000 + id}`,
            Warranty: '1 Year Manufacturer Warranty',
            'In The Box': `1 ${noun}, User Manual, Warranty Card`,
          },
          createdAt: new Date(Date.now() - Math.floor(rand() * 1000 * 60 * 60 * 24 * 90)),
        });
        id++;
      }
    });
  });

  return products;
};

const buildReviewsFor = (product) => {
  const seed = product._id.toString().split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const rand = seededRandom(seed || 1);
  const count = Math.min(20, (product.reviewCount % 12) + 4);

  return Array.from({ length: count }).map(() => {
    const variance = Math.round((rand() - 0.5) * 2);
    const rating = Math.min(5, Math.max(1, Math.round(product.rating) + variance));
    const titles = TITLES_BY_RATING[rating];
    return {
      product: product._id,
      author: REVIEWERS[Math.floor(rand() * REVIEWERS.length)],
      rating,
      title: titles[Math.floor(rand() * titles.length)],
      comment: COMMENTS[Math.floor(rand() * COMMENTS.length)],
      helpfulCount: Math.floor(rand() * 120),
      verified: rand() > 0.25,
    };
  });
};

const COUPONS = [
  { code: 'SAVE10', type: 'percent', value: 10, maxDiscount: 500, minOrder: 0, description: '10% off, up to ₹500' },
  { code: 'FLAT500', type: 'flat', value: 500, maxDiscount: 500, minOrder: 2000, description: '₹500 off on orders above ₹2,000' },
  { code: 'WELCOME50', type: 'flat', value: 50, maxDiscount: 50, minOrder: 0, description: '₹50 off for new customers' },
];

const run = async () => {
  await connectDB();

  console.log('Clearing existing Product, Review and Coupon collections...');
  await Promise.all([Product.deleteMany({}), Review.deleteMany({}), Coupon.deleteMany({})]);

  console.log('Inserting products...');
  const products = await Product.insertMany(buildProducts());
  console.log(`Inserted ${products.length} products.`);

  console.log('Generating reviews...');
  const reviews = products.flatMap(buildReviewsFor);
  await Review.insertMany(reviews);
  console.log(`Inserted ${reviews.length} reviews.`);

  console.log('Inserting coupons...');
  await Coupon.insertMany(COUPONS);
  console.log(`Inserted ${COUPONS.length} coupons.`);

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
