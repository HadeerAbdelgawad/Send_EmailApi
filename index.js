// Server file for local development
const port = process.env.PORT || 3000;

const express = require("express");
const cors = require("cors");
require("dotenv").config(); // ← تحميل متغيرات البيئة
const { connectToDatabase } = require("./src/db/mongoose");
const orderRouter = require("./src/routers/order");

// ** CONFIG
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


// // Server file for local development
// const port = process.env.PORT || 3000;

// import express from "express";
// import cors from "cors";
// import "dotenv/config";
// import { connectToDatabase } from "./src/db/mongoose.js";
// import orderRouter from "./src/routers/order.js";
// // ** CONFIG
// const app = express();

// app.use(express.json());
// app.use(cors());
// connectToDatabase();

// // ** API ENDPOINTS
// // Import and use routes
// app.use("/api", orderRouter);

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "ok", message: "Service is running" });
// });

// app.listen(port, () => {
//   console.log("server running on port: " + port);
// });