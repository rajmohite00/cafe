const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus } = require('../controllers/orderController');

router.route('/')
  .post(createOrder)
  .get(getAllOrders); // Admin will fetch from here

router.route('/:id')
  .put(updateOrderStatus); // Admin update status

module.exports = router;
