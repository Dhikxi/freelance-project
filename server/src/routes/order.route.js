const express = require('express');
const { userMiddleware } = require('../middlewares');
const {
  getOrders,
  paymentIntent,
  updatePaymentStatus,
  confirmPayment,
} = require('../controllers/order.controller');

const router = express.Router();

// ✅ Get all orders
router.get('/', userMiddleware, getOrders);

// ✅ Create Stripe payment intent using project ID
router.post('/create-payment-intent/:_id', userMiddleware, paymentIntent);

// ✅ Update order after payment success
router.patch('/', userMiddleware, updatePaymentStatus);

// ✅ Confirm payment from Success page
router.post('/confirm-payment', confirmPayment);

module.exports = router;
