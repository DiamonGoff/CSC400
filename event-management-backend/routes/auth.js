const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = Date.now() + 3600000; // 1 hour expiry

    const newUser = new User({
      name,
      email,
      password, // Store plain text password (not recommended)
      verificationToken,
      verificationTokenExpiry
    });

    await newUser.save();

    // Send verification email
    try {
      await sendVerificationEmail(newUser.email, verificationToken);
      res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      res.status(500).json({ message: 'User registered, but error sending email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

// Verify user email
router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    const currentDateTime = new Date();
    if (user.verificationTokenExpiry < currentDateTime) {
      const newVerificationToken = crypto.randomBytes(32).toString('hex');
      const newVerificationTokenExpiry = Date.now() + 3600000; // 1 hour expiry

      user.verificationToken = newVerificationToken;
      user.verificationTokenExpiry = newVerificationTokenExpiry;
      await user.save();

      await sendVerificationEmail(user.email, newVerificationToken);

      return res.status(400).json({ message: 'Verification token expired. A new verification email has been sent.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error during verification:', error);
    res.status(500).json({ message: 'Error verifying email', error: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('User found:', user);
    console.log('Password being compared:', password); // Log plain text password being compared
    console.log('Stored password from DB:', user.password); // Log stored password from DB

    if (password !== user.password) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      console.log('Email not verified');
      return res.status(400).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Generated token:', token);

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', user: { _id: user._id, name: user.name, email: user.email }, token });
  } catch (error) {
    console.log('Error logging in:', error.message);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

module.exports = router;
