const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/persis', { useNewUrlParser: true, useUnifiedTopology: true });

// User Schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String
});
const User = mongoose.model('User', UserSchema);

// OTP Storage (In-memory for simplicity, use Redis in production)
const otps = {};

// Email Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // Use App Password if 2FA is enabled
    }
});

// Send OTP
app.post('/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otps[email] = { code: otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

    transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    }, (err) => {
        if (err) return res.json({ message: 'Error sending OTP' });
        res.json({ message: 'OTP sent!' });
    });
});

// Verify OTP
app.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = otps[email];
    if (storedOtp && storedOtp.code === otp && storedOtp.expires > Date.now()) {
        delete otps[email];
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

// Signup
app.post('/signup', (req, res) => {
    const user = new User(req.body);
    user.save().then(() => res.json({ success: true }));
});

app.listen(3000, () => console.log('Server running on port 3000'));