const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/authenticate');

<<<<<<< HEAD
// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
=======
// Get all tasks for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id });
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task
<<<<<<< HEAD
router.post('/', async (req, res) => {
  const { title, description, dueDate, priority, status, assignedTo, eventId } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  const task = new Task({
    title,
    description,
    dueDate,
    priority,
    status,
    assignedTo,
    eventId
  });

=======
router.post('/', authenticate, async (req, res) => {
  const task = new Task({
    ...req.body,
    userId: req.user._id
  });
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

<<<<<<< HEAD
// Get tasks by event
router.get('/event/:eventId', async (req, res) => {
  try {
    const tasks = await Task.find({ eventId: req.params.eventId });
=======
// Get tasks by event for the logged-in user
router.get('/event/:eventId', authenticate, async (req, res) => {
  try {
    const tasks = await Task.find({ eventId: req.params.eventId, userId: req.user._id });
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a task
<<<<<<< HEAD
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
=======
router.put('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    Object.assign(task, req.body);
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a task
<<<<<<< HEAD
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
=======
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
>>>>>>> 123ae86bc8913d2bbf5a57f14d21b19963103560
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
