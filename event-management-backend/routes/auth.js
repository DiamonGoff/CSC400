const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendVerificationEmail, sendEventInviteEmail } = require('../services/emailService');
const verifyToken = require('../middleware/verifyToken');

// Verify Token Route
router.post('/verify-token', verifyToken, (req, res) => {
  res.status(200).json({ message: 'Token is valid', user: req.user });
});

// Register a new user
router.post('/register', async (req, res) => {
  const { name, email, password, token } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    let role = 'organizer';
    let isVerified = false;

    if (token) {
      // If the user is registering via an invitation, decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      role = 'attendee';
      isVerified = true; // Automatically verify if registering via invite
    }

    const newUser = new User({
      name,
      email,
      password, // Store plain text password (not recommended)
      role,
      isVerified,
    });

    await newUser.save();

    if (!token) {
      // Send verification email for new organizer registration
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpiry = Date.now() + 3600000; // 1 hour expiry

      newUser.verificationToken = verificationToken;
      newUser.verificationTokenExpiry = verificationTokenExpiry;
      await newUser.save();

      try {
        await sendVerificationEmail(newUser.email, verificationToken);
        res.status(201).json({ message: 'User registered successfully. Verification email sent.' });
      } catch (emailError) {
        console.error('Error sending email:', emailError);
        res.status(500).json({ message: 'User registered, but error sending email' });
      }
    } else {
      res.status(201).json({ message: 'User registered successfully via invite.' });
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
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: 'Email not verified' });
    }

    // Optionally set role if provided in the request
    if (role && ['organizer', 'attendee'].includes(role)) {
      user.role = role;
      await user.save();
    }

    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.json({ message: 'Login successful', user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

// Update role route
router.put('/update-role', verifyToken, async (req, res) => {
  const { userId, role } = req.body;

  if (!['organizer', 'attendee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add a check to ensure only authorized users can update roles
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

module.exports = router;
