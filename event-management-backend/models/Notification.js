const mongoose = require('mongoose');

// Define schema for notifications
const NotificationSchema = new mongoose.Schema({
    message: {
        type: String, // Notification message content
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user receiving the notification
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date, // Timestamp for when the notification was created
        default: Date.now
    },
    read: {
        type: Boolean, // Status to track if the notification has been read
        default: false
    }
});

// Export Notification model based on the schema
module.exports = mongoose.model('Notification', NotificationSchema);
