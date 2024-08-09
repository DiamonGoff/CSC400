const mongoose = require('mongoose');

// Define schema for tasks
const taskSchema = new mongoose.Schema({
  title: {
    type: String, // Task title
    required: true,
    set: (value) => {
      console.log('Setting title:', value); // Log when setting title
      return value;
    },
    get: (value) => {
      console.log('Getting title:', value); // Log when getting title
      return value;
    }
  },
  description: {
    type: String, // Task description
    set: (value) => {
      console.log('Setting description:', value); // Log when setting description
      return value;
    },
    get: (value) => {
      console.log('Getting description:', value); // Log when getting description
      return value;
    }
  },
  dueDate: {
    type: Date, // Task due date
    set: (value) => {
      console.log('Setting dueDate:', value); // Log when setting due date
      return value;
    },
    get: (value) => {
      console.log('Getting dueDate:', value); // Log when getting due date
      return value;
    }
  },
  priority: {
    type: String, // Task priority
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
    set: (value) => {
      console.log('Setting priority:', value); // Log when setting priority
      return value;
    },
    get: (value) => {
      console.log('Getting priority:', value); // Log when getting priority
      return value;
    }
  },
  status: {
    type: String, // Task status
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
    set: (value) => {
      console.log('Setting status:', value); // Log when setting status
      return value;
    },
    get: (value) => {
      console.log('Getting status:', value); // Log when getting status
      return value;
    }
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User who created the task
    ref: 'User',
    required: true,
    set: (value) => {
      console.log('Setting userId:', value); // Log when setting userId
      return value;
    },
    get: (value) => {
      console.log('Getting userId:', value); // Log when getting userId
      return value;
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User assigned to the task
    ref: 'User',
    set: (value) => {
      console.log('Setting assignedTo:', value); // Log when setting assignedTo
      return value;
    },
    get: (value) => {
      console.log('Getting assignedTo:', value); // Log when getting assignedTo
      return value;
    }
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the associated Event
    ref: 'Event',
    set: (value) => {
      console.log('Setting eventId:', value); // Log when setting eventId
      return value;
    },
    get: (value) => {
      console.log('Getting eventId:', value); // Log when getting eventId
      return value;
    }
  }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Export Task model based on the schema
module.exports = mongoose.model('Task', taskSchema);
