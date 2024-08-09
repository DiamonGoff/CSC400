const express = require('express');
const router = express.Router();
const GiftSuggestion = require('../models/GiftSuggestion');

// Get all gift suggestions for an event
router.get('/:eventId', async (req, res) => {
  try {
    const suggestions = await GiftSuggestion.find({ eventId: req.params.eventId });
    res.json(suggestions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new gift suggestion for an event
router.post('/:eventId', async (req, res) => {
  const suggestion = new GiftSuggestion({
    suggestion: req.body.suggestion,
    eventId: req.params.eventId,
  });

  try {
    const newSuggestion = await suggestion.save();
    res.status(201).json(newSuggestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a gift suggestion from a specific event
router.delete('/:eventId/:id', async (req, res) => {
  try {
    await GiftSuggestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Gift suggestion deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
