const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3001/auth/verify-email?token=${token}`;
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Please verify your email address by clicking on the following link: ${verificationUrl}`,
    html: `<p>Please verify your email address by clicking on the following link:</p><p><a href="${verificationUrl}">${verificationUrl}</a></p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Verification email sent to', email);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Error sending verification email');
  }
};

module.exports = { sendVerificationEmail };
