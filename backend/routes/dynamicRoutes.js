const express = require('express');
const router  = express.Router();
const { MenuItem, Reservation, Contact, BlogPost, SiteSetting } = require('../models/Dynamic');

const models = {
  menu:         MenuItem,
  reservations: Reservation,
  contacts:     Contact,
  posts:        BlogPost,
};

// ── Singleton Settings (hours / seo / design) ──────────────────────────────
// GET  /api/data/settings/:key  → fetch one setting doc
router.get('/settings/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: req.params.key });
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT  /api/data/settings/:key  → upsert (create or update) a setting doc
router.put('/settings/:key', async (req, res) => {
  try {
    const setting = await SiteSetting.findOneAndUpdate(
      { key: req.params.key },
      { key: req.params.key, value: req.body.value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json({ success: true, data: setting });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ── Generic CRUD ───────────────────────────────────────────────────────────
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
