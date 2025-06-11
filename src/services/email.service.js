const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',  // Using Gmail service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS  // Using App Password, not regular Gmail password
  }
});

// HTML template for confirmation email
const getConfirmationEmailTemplate = (name, userId) => {
  const confirmationUrl = `${process.env.FRONTEND_URL}/confirm-email/${userId}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirm your email</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo {
          max-width: 150px;
          margin-bottom: 20px;
        }
        h1 {
          color: #2c3e50;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #3498db;
          color: white !important;
          text-decoration: none;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #2980b9;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <!-- Add your logo here -->
          <h1>Welcome to Bike Rental!</h1>
        </div>
        
        <p>Hi ${name},</p>
        <p>Thank you for registering with our bike rental service. To complete your registration and start renting bikes, please confirm your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${confirmationUrl}" class="button">Confirm Email Address</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p>${confirmationUrl}</p>
        
        <p>This confirmation link will expire in 24 hours.</p>
        
        <div class="footer">
          <p>If you didn't create an account with us, please ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} Bike Rental. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send confirmation email
const sendConfirmationEmail = async (userEmail, name, userId) => {
  try {
    await transporter.sendMail({
      from: `"Bike Rental" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Please confirm your email address',
      html: getConfirmationEmailTemplate(name, userId)
    });

    console.log('Confirmation email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};

module.exports = {
  sendConfirmationEmail
}; 