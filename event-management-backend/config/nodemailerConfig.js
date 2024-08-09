// Import nodemailer for email handling
const nodemailer = require('nodemailer');

// Setup transporter using Gmail and environment variables for credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,       // Sender email
    pass: process.env.EMAIL_PASSWORD, // Email password
  },
});

// Export transporter for use in other files
module.exports = transporter;
