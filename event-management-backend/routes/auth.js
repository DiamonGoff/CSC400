const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail } = require('../services/emailService');

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, isVerified: false });
        await user.save();

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        await sendVerificationEmail(email, token);

        res.status(201).json({ message: 'User registered. Please check your email to verify your account.' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user.' });
    }
});

// Email Verification Route
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid token or user not found.' });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
});

module.exports = router;
