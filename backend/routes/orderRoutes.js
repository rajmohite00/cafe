const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus, getOrderById, getUserOrders } = require('../controllers/orderController');

router.route('/')
  .post(createOrder)
  .get(getAllOrders);

router.get('/user/:userId', getUserOrders); // Per-user order history

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus);

module.exports = router;
