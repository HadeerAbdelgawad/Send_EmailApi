// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();


// const app = express();
// const port = process.env.PORT || 3000;

// // Import database connection
// const { connectToDatabase } = require('./src/db/mongoose');
// connectToDatabase();


// // فتح CORS لكل الدومينات (Enable CORS for all domains)
// // app.use((req, res, next) => {
// //     res.header('Access-Control-Allow-Origin', '*');
// //     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// //     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
// //     res.header('Access-Control-Allow-Credentials', 'true');
    
// //     // Handle OPTIONS method
// //     if (req.method === 'OPTIONS') {
// //         return res.status(200).end();
// //     }
    
// //     next();
// // });

// // Standard CORS middleware as backup
// const corsOptions = {
//     origin: 'https://ksa-afflite.vercel.app',
//     methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept'],
//     credentials: true,
//     credentials: true,
//     optionsSuccessStatus: 204 
// };
// app.use(cors(corsOptions));

// // Middleware setup
// app.use(express.json());

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



// Server file for local development
const port = process.env.PORT || 3000;

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { connectToDatabase } from "./src/db/mongoose.js";
const express = require('express');

const orderRouter = require('./src/routers/order');
// ** CONFIG
require('dotenv').config();
const { connectToDatabase } = require('./src/db/mongoose');

const cors = require("cors"); 
const app = express();

app.use(express.json());
app.use(cors());
connectToDatabase();

// ** API ENDPOINTS
// Import and use routes
app.use("/api", orderRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Service is running" });
});

app.listen(port, () => {
  console.log("server running on port: " + port);
});
