const express = require('express');
const { validateCoupon, listCoupons } = require('../controllers/couponController');

const router = express.Router();

router.get('/', listCoupons);
router.post('/validate', validateCoupon);

module.exports = router;
