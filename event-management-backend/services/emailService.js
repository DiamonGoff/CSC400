const nodemailer = require('nodemailer');

// Configure Nodemailer transporter for sending emails via Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL, // Email address from environment variables
    pass: process.env.EMAIL_PASSWORD, // Email password from environment variables
  },
});

// Function to send a verification email to the user
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3001/auth/verify-email?token=${token}`; // Construct verification URL with the token
  const mailOptions = {
    from: process.env.EMAIL, // Sender email address
    to: email, // Recipient email address
    subject: 'Email Verification', // Email subject
    text: `Please verify your email address by clicking on the following link: ${verificationUrl}`, // Plain text body
    html: `<p>Please verify your email address by clicking on the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>` // HTML body
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email
    console.log('Verification email sent to', email); // Log success message
  } catch (error) {
    console.error('Error sending email:', error); // Log error if sending fails
    throw new Error('Error sending verification email'); // Throw error to be handled by caller
  }
};

// Function to send an event invite email to a user
const sendEventInviteEmail = async (email, inviteLink, event) => {
  const mailOptions = {
    from: process.env.EMAIL, // Sender email address
    to: email, // Recipient email address
    subject: `You're invited to ${event.name}`, // Email subject
    text: `You have been invited to ${event.name}. Click the link to join: ${inviteLink}`, // Plain text body
    html: `<p>You have been invited to <strong>${event.name}</strong>. Click the link to join:</p><p><a href="${inviteLink}">${inviteLink}</a></p>` // HTML body
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email
    console.log('Invite email sent to', email); // Log success message
  } catch (error) {
    console.error('Error sending email:', error); // Log error if sending fails
    throw new Error('Error sending invite email'); // Throw error to be handled by caller
  }
};

// Export the email sending functions
module.exports = { sendVerificationEmail, sendEventInviteEmail };
