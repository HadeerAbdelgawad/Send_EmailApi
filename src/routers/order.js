require('dotenv').config();

const express = require('express');
const Order = require('../models/order')
const mongoose = require('mongoose');
const { connectToDatabase } = require('../db/mongoose');

const router = express.Router()
const nodemailer = require('nodemailer');

// Middleware for validating request body
const validateOrderData = (req, res, next) => {
  const { email, details, userName, phoneNumber } = req.body;

  if (!email || !details || !userName || !phoneNumber) {
    return res.status(400).json({ error: 'Missing required fields: userName, email, and details are required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  next();
};

router.post('/order', validateOrderData, async (req, res) => {
  const { email, phoneNumber, details, userName } = req.body;
  // Create new order instance
  const order = new Order(req.body)
  try {
    // قم بالاتصال بقاعدة البيانات أولاً
    await connectToDatabase();
    
    // Save order to database
    console.log('Attempting to save order to database:', { userName, email,details, phoneNumber });
    const savedOrder = await order.save();
    console.log('Order saved successfully with ID:', savedOrder._id);// Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // يسمح بالاتصال حتى مع شهادات SSL غير موثقة
      }
    });

    console.log(`Attempting to send email to: ${process.env.EMAIL_USER}`);
      // Setup email content
    const mailOptions = {
      from: `Customer Request ${process.env.EMAIL_USER}`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: 'New Customer Request',
      text: `
            New request from: ${userName}
            📩 Email: ${email}
            📞 Phone: ${phoneNumber || 'Not provided'}
            📝 Details: ${details}
            `,
      html: `
            <h2>New Customer Request</h2>
            <p><strong>Name:</strong> ${userName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phoneNumber || 'Not provided'}</p>
            <p><strong>Details:</strong> ${details}</p>
            `
    };// Send email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.response);
      
      // Return success response
      res.status(200).json({
        success: true,
        message: 'Order saved and notification email sent successfully'
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      
      // Still return success since order was saved
      res.status(200).json({
        success: true,
        message: 'Order saved but email notification failed',
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('Error processing order:', error);

    // Return appropriate error response
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors
      });
    }
    
    // Check for MongoDB connection error
    if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoNetworkError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error',
        details: 'Unable to connect to the database. Please try again later.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
      errorName: error.name // Add error name for better debugging
    });
  }
});

// Add a route to check database connection
router.get('/db-status', async (req, res) => {
  try {
    // محاولة الاتصال بقاعدة البيانات
    await connectToDatabase();
    
    // التحقق من حالة الاتصال
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    if (state === 1) {
      // If connected, try to perform a test query
      const count = await Order.countDocuments();
      
      return res.status(200).json({
        success: true,
        connection: states[state],
        orderCount: count,
        message: 'Database connection is working properly'
      });
    } else {
      return res.status(503).json({
        success: false,
        connection: states[state],
        message: 'Database is not connected'
      });
    }
  } catch (error) {
    console.error('Error checking database status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: error.message
    });
  }
});

module.exports = router
