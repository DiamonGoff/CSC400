const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, // Ensure the name is required
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    facebookId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values
    },
    twitterId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values
    },
});

module.exports = mongoose.model('User', UserSchema);
