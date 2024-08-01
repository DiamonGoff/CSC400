const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const Venue = require('../models/Venue');

// Get all favorite venues
router.get('/', async (req, res) => {
  try {
    const favorites = await Favorite.find().populate('venue');
    console.log('Fetched favorites:', favorites);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorite venues:', error);
    res.status(500).json({ message: 'Error fetching favorite venues' });
  }
});

// Add a favorite venue
router.post('/add', async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) {
      console.error('Venue ID is required');
      return res.status(400).json({ message: 'Venue ID is required' });
    }
    console.log('Adding favorite venue with ID:', venueId);
    const favorite = new Favorite({ venue: venueId });
    await favorite.save();
    const populatedFavorite = await favorite.populate('venue');
    console.log('Favorite added:', populatedFavorite);
    res.status(201).json(populatedFavorite);
  } catch (error) {
    console.error('Error adding favorite venue:', error);
    res.status(500).json({ message: 'Error adding favorite venue' });
  }
});

// Remove a favorite venue
router.post('/remove', async (req, res) => {
  try {
    const { venueId } = req.body;
    if (!venueId) {
      console.error('Venue ID is required');
      return res.status(400).json({ message: 'Venue ID is required' });
    }
    console.log('Removing favorite venue with ID:', venueId);
    await Favorite.deleteOne({ venue: venueId });
    console.log('Favorite removed');
    res.status(200).json({ message: 'Favorite venue removed' });
  } catch (error) {
    console.error('Error removing favorite venue:', error);
    res.status(500).json({ message: 'Error removing favorite venue' });
  }
});

// Delete a favorite venue by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting favorite venue with ID:', id);
    await Favorite.findByIdAndDelete(id);
    console.log('Favorite deleted');
    res.status(200).json({ message: 'Favorite venue deleted' });
  } catch (error) {
    console.error('Error deleting favorite venue:', error);
    res.status(500).json({ message: 'Error deleting favorite venue' });
  }
});

module.exports = router;
