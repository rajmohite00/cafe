const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus, getOrderById } = require('../controllers/orderController');

router.route('/')
  .post(createOrder)
  .get(getAllOrders); // Admin will fetch from here

router.route('/:id')
  .get(getOrderById)
  .put(updateOrderStatus); // Admin update status

module.exports = router;
