const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
    const { name, email, phone, message, address, service, preferredDate } = req.body;

    try {
        // Email to the business
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to yourself
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Property Address:</strong> ${address}</p>
                <p><strong>Service Needed:</strong> ${service}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        });

        // Confirmation email to the user
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Thank you for contacting Best Choice Home Inspections',
            html: `
                <h3>Thank you for contacting Best Choice Home Inspections!</h3>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p>Here's a copy of the information you submitted:</p>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Property Address:</strong> ${address}</p>
                <p><strong>Service Needed:</strong> ${service}</p>
                <p><strong>Preferred Date:</strong> ${preferredDate}</p>
                <p><strong>Additional Information:</strong></p>
                <p>${message}</p>
                <br>
                <p>Best regards,</p>
                <p>Best Choice Home Inspections Team</p>
            `
        });

        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send message. Please try again later.' });
    }
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/services.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'services.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 