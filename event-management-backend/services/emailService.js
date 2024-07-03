const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendVerificationEmail = async (email, token) => {
    const url = `http://localhost:3001/auth/verify/${token}`;

    await transporter.sendMail({
        to: email,
        subject: 'Verify Your Email',
        html: `<h4>Welcome!</h4><p>Please click <a href="${url}">here</a> to verify your email.</p>`
    });
};

module.exports = {
    sendVerificationEmail
};
