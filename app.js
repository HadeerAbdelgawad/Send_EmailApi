const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');

// CORS configuration for security
const cors = require('cors');
const corsOptions = {
    origin:  function (origin, callback) {
        const allowedOrigins = [
          'http://localhost:5174',
          'https://your-frontend-domain.vercel.app', // عدّله للدومين الحقيقي بتاعك
        ];
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
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
      return res.status(200).end(); // رد سريع بدون استكمال باقي الميدل وير
    }
    next();
  });

  app.use(express.json());


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

