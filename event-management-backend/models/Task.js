const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    set: (value) => {
      console.log('Setting title:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting title:', value);
      return value;
    }
  },
  description: {
    type: String,
    set: (value) => {
      console.log('Setting description:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting description:', value);
      return value;
    }
  },
  dueDate: {
    type: Date,
    set: (value) => {
      console.log('Setting dueDate:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting dueDate:', value);
      return value;
    }
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
    set: (value) => {
      console.log('Setting priority:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting priority:', value);
      return value;
    }
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
    default: 'Not Started',
    set: (value) => {
      console.log('Setting status:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting status:', value);
      return value;
    }
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    set: (value) => {
      console.log('Setting assignedTo:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting assignedTo:', value);
      return value;
    }
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    set: (value) => {
      console.log('Setting eventId:', value);
      return value;
    },
    get: (value) => {
      console.log('Getting eventId:', value);
      return value;
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
