// backend/server.js

const express = require('express'); // Add this line
const app = require('./app'); // Import the Express app from app.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');


dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// Middleware
app.use(express.json());



// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Recommended for newer versions
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// Start the server after successful DB connection
mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});