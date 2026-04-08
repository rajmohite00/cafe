const Order = require('../models/Order');

// @desc    Create a new order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount } = req.body;

    const newOrder = new Order({
      customerName,
      customerEmail,
      items,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    
    // Log Activity
    const Activity = require('../models/Activity');
    await Activity.create({
      type: 'order',
      description: `New order placed by ${customerName} for ₹${totalAmount}`,
      ipAddress: 'System'
    });

    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get all orders for admin panel
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
