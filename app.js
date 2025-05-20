const express = require('express');
const cors = require('cors');
// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');
const orderRouter = require('./src/routers/order');

const app = express();
const port = process.env.PORT || 3000;



connectToDatabase()
  .then(() => console.log('✅ MongoDB connected at app start'))
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1); // Exit the app if connection fails
  });

  app.use(express.json());


  // Standard CORS middleware as backup
app.use(cors({
    origin: 'https://ksa-afflite.vercel.app',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    credentials: true
}));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle OPTIONS method
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    next();
});


  app.use('/api/order', orderRouter);

  // Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
});


  // Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Unexpected error',
      errorName: err.name
    });
  });


// Start server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on  http://localhost${port}`);
    });
}

module.exports = app;