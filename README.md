# Email Notification Service

AtHSk0lTXzfQH2Zd
hadeer

A Node.js application that provides an API endpoint for receiving order data, storing it in MongoDB, and sending email notifications.

## Features

- RESTful API endpoint for receiving order information
- MongoDB database storage
- Email notifications via Gmail
- Input validation
- Error handling
- Ready for deployment on Vercel

## Setup Instructions

### Prerequisites

- Node.js (v14 or later)
- MongoDB
- Gmail account (for sending notifications)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database configuration
MONGODB_URI=mongodb://127.0.0.1:27017/ksa-afflite

# Email configuration
EMAIL_USER=your-gmail-account@gmail.com
EMAIL_PASS=your-app-password

# Server configuration
PORT=3000
```

**Note:** For EMAIL_PASS, use an [App Password](https://support.google.com/accounts/answer/185833) from Google, not your regular password.

### Installation

1. Install dependencies:

   ```
   npm install
   ```

2. Start the server:

   ```
   node server.js
   ```

## API Documentation

### Order Endpoint

**POST /api/order**

Creates a new order and sends an email notification.

**Request Body:**

```json
{
  "userName": "Customer Name",
  "email": "customer@example.com",
  "details": "Order details here",
  "phoneNumber": "1234567890"
}
```

**Response:**

Success (200):

```json
{
  "success": true,
  "message": "Order saved and notification email sent successfully"
}
```

Error (400-500):

```json
{
  "success": false,
  "message": "Error message",
  "errors": {} // Optional validation errors
}
```

## Deployment on Vercel

This application is configured for Vercel deployment using the vercel.json file.

1. Install Vercel CLI:

   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:

   ```
   vercel
   ```

## License

ISC
