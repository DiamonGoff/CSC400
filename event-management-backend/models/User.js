const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    contact: {
        type: String,
        default: '', // Optional: set default to empty string
    },
    preferences: {
        type: String,
        default: '', // Optional: set default to empty string
    }
});

module.exports = mongoose.model('User', UserSchema);
