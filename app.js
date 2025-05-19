const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');

// CORS configuration for security
const cors = require('cors');
const corsOptions = {
    origin: ['http://localhost:3000','http://localhost:5175/', 'https://your-frontend-domain.com', '*'], // Add your frontend domains and allow all origins during development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware setup
app.use(express.json());
app.use(cors(corsOptions));

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

