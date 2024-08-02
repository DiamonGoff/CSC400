const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Get all tasks
router.get('/', async (req, res) => {
    try {
        console.log('Fetching all tasks');
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error('Error fetching all tasks:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create a new task
router.post('/', async (req, res) => {
    console.log('Creating a new task with data:', req.body);
    const task = new Task(req.body);
    try {
        const newTask = await task.save();
        console.log('Task created successfully:', newTask);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Error creating new task:', err);
        res.status(400).json({ message: err.message });
    }
});

// Get tasks by event
router.get('/event/:eventId', async (req, res) => {
    console.log(`Fetching tasks for event ID: ${req.params.eventId}`);
    try {
        const tasks = await Task.find({ eventId: req.params.eventId });
        console.log(`Tasks for event ID ${req.params.eventId}:`, tasks);
        res.json(tasks);
    } catch (err) {
        console.error(`Error fetching tasks for event ID ${req.params.eventId}:`, err);
        res.status(500).json({ message: err.message });
    }
});

// Update a task
router.put('/:id', async (req, res) => {
    console.log(`Updating task ID: ${req.params.id} with data:`, req.body);
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.error('Task not found for ID:', req.params.id);
            return res.status(404).json({ message: 'Task not found' });
        }
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        console.log('Task updated successfully:', updatedTask);
        res.json(updatedTask);
    } catch (err) {
        console.error(`Error updating task ID ${req.params.id}:`, err);
        res.status(400).json({ message: err.message });
    }
});

// Delete a task
router.delete('/:id', async (req, res) => {
    console.log(`Deleting task ID: ${req.params.id}`);
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            console.error('Task not found for ID:', req.params.id);
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        console.log('Task deleted successfully:', task);
        res.json({ message: 'Task deleted' });
    } catch (err) {
        console.error(`Error deleting task ID ${req.params.id}:`, err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
