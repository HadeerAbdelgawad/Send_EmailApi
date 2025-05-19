const express = require('express');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:5174',
    'http://localhost:5175',  // ضفت الدومين ده عشان يتطابق مع اللي في الخطأ
    'https://your-frontend-domain.vercel.app', // عدّله للدومين الحقيقي بتاعك
  ];

  app.use(express.json());

  
// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');

// CORS configuration for security
const corsOptions = {
    origin:  function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
      },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware setup
app.use(cors(corsOptions));



app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });



// Import and use routes
const orderRouter = require('./src/routers/order');
app.use('/api', orderRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// Only start server when running directly, not when imported
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;

