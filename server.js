require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ------------------------------------------------------------------
// EMAIL TRANSPORTER SETUP
// ------------------------------------------------------------------
let transporter;

async function setupEmailTransporter() {
  const useEthereal = process.env.USE_ETHEREAL === 'true';

  if (useEthereal) {
    console.log('Generating Ethereal email test account...');
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('Ethereal test account ready. Emails will be caught here instead of actually sending.');
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('Real SMTP transporter configured.');
  }
}

// Call setup on startup
setupEmailTransporter().catch(console.error);

// Helper function to send email
async function sendNotificationEmail(subject, htmlBody) {
  if (!transporter) return;
  
  const mailOptions = {
    from: '"Xecurra Website" <noreply@xecurra.com>',
    to: process.env.RECEIVER_EMAIL || 'hello@xecurra.com',
    subject: subject,
    html: htmlBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    if (process.env.USE_ETHEREAL === 'true') {
      console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    }
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// ------------------------------------------------------------------
// API ENDPOINTS
// ------------------------------------------------------------------

// 1. Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
  console.log('--- New Contact Form Submission ---', req.body);
  
  const html = `
    <h2>New Contact Us Message</h2>
    <p><strong>Name:</strong> ${req.body.name || 'N/A'}</p>
    <p><strong>Company:</strong> ${req.body.company || 'N/A'}</p>
    <p><strong>Email:</strong> ${req.body.email || 'N/A'}</p>
    <p><strong>Phone:</strong> ${req.body.phone || 'N/A'}</p>
    <p><strong>Requirement:</strong> ${req.body.requirement || 'N/A'}</p>
    <p><strong>Message:</strong> ${req.body.message || 'N/A'}</p>
  `;
  
  await sendNotificationEmail('New Contact Form Submission', html);
  res.status(200).json({ success: true, message: 'Message received successfully!' });
});

// 2. Demo Request Endpoint
app.post('/api/demo', async (req, res) => {
  console.log('--- New Demo Request ---', req.body);
  
  // Try to get values from standard input names or IDs
  const name = req.body['demo-name'] || req.body.name || 'N/A';
  const company = req.body['demo-company'] || req.body.company || 'N/A';
  const email = req.body['demo-email'] || req.body.email || 'N/A';
  const phone = req.body['demo-phone'] || req.body.phone || 'N/A';
  const query = req.body['demo-query'] || req.body.query || 'N/A';

  const html = `
    <h2>New Demo Request</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Company:</strong> ${company}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Looking For:</strong> ${query}</p>
  `;

  await sendNotificationEmail('New Demo Request', html);
  res.status(200).json({ success: true, message: 'Demo request received successfully!' });
});

// 3. Newsletter Subscription Endpoint
app.post('/api/newsletter', async (req, res) => {
  console.log('--- New Newsletter Subscription ---', req.body);
  
  const html = `
    <h2>New Newsletter Subscriber</h2>
    <p><strong>Email:</strong> ${req.body.email}</p>
  `;

  await sendNotificationEmail('New Newsletter Subscriber', html);
  res.status(200).json({ success: true, message: 'Subscribed successfully!' });
});

// Fallback for 404s
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
