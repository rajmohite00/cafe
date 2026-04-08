const express = require('express');
const router = express.Router();
const { MenuItem, Reservation, Contact, BlogPost } = require('../models/Dynamic');

const models = {
  menu: MenuItem,
  reservations: Reservation,
  contacts: Contact,
  posts: BlogPost
};

// Generic CRUD
router.get('/:resource', async (req, res) => {
  try {
    const Model = models[req.params.resource];
    if (!Model) return res.status(404).json({ success: false, message: 'Resource not found' });
    const data = await Model.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/:resource', async (req, res) => {
  try {
    const Model = models[req.params.resource];
    if (!Model) return res.status(404).json({ success: false, message: 'Resource not found' });
    const newItem = new Model(req.body);
    await newItem.save();
    res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put('/:resource/:id', async (req, res) => {
  try {
    const Model = models[req.params.resource];
    if (!Model) return res.status(404).json({ success: false, message: 'Resource not found' });
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:resource/:id', async (req, res) => {
  try {
    const Model = models[req.params.resource];
    if (!Model) return res.status(404).json({ success: false, message: 'Resource not found' });
    await Model.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
