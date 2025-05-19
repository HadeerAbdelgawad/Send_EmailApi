// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = process.env.PORT || 3000;

// // Import database connection
// const { connectToDatabase } = require('./src/db/mongoose');

// // Middleware setup
// app.use(express.json());

// // فتح CORS لكل الدومينات (Enable CORS for all domains)
// const corsOptions = {
//     origin: '*',                  // Allow all origins
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//     credentials: true
// };

// app.use(cors(corsOptions));
// app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// // Import and use routes
// const orderRouter = require('./src/routers/order');
// app.use('/api', orderRouter);

// // Health check endpoint
// app.get('/health', (req, res) => {
//     res.status(200).json({ status: 'ok', message: 'Service is running' });
// });

// // Start server
// if (require.main === module) {
//     app.listen(port, () => {
//         console.log(`Server running on port ${port}`);
//     });
// }

// module.exports = app;

////////////////////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Import database connection
const { connectToDatabase } = require('./src/db/mongoose');

// Middleware setup
app.use(express.json());

// فتح CORS لكل الدومينات (Enable CORS for all domains)
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

// Standard CORS middleware as backup
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
    credentials: true
}));

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