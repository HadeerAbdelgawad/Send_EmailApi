const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');

// Middleware setup
app.use(express.json());

// فتح CORS لكل الدومينات (Enable CORS for all domains)
const corsOptions = {
    origin: '*',                  // Allow all origins
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// Import and use routes
const orderRouter = require('./src/routers/order');
app.use('/api', orderRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Service is running' });
});

// Start server
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = app;