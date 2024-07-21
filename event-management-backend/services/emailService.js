const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, token) => {
    const url = `http://localhost:3001/auth/verify/${token}`;
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Verify your email',
        html: `<p>Please click the link below to verify your email:</p><p><a href="${url}">${url}</a></p>`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
