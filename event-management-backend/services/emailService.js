// services/emailService.js
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

const sendEventInviteEmail = async (email, event) => {
    const url = `http://localhost:3000/event/${event._id}`;

    await transporter.sendMail({
        to: email,
        subject: `You're Invited to ${event.name}!`,
        html: `<h4>You are invited to ${event.name}</h4>
               <p>Date: ${new Date(event.date).toLocaleDateString()}</p>
               <p>Time: ${event.time}</p>
               <p>Location: ${event.location}</p>
               <p>Description: ${event.description}</p>
               <p>Please click <a href="${url}">here</a> to view the event details.</p>`
    });
};

module.exports = {
    sendVerificationEmail,
    sendEventInviteEmail
};
