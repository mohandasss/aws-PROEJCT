const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fileRoutes = require('./routes/fileRoutes');
const testRoutes = require('./routes/test');

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000','https://aws-proejct.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple test route
app.get("/", (req, res) => {
  res.send("S3 File Upload API is running 🚀\nCheck /api/files for file operations");
});

// File routes
app.use('/api', fileRoutes);
app.use('/api', testRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

const PORT = process.env.PORT || 8080;

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
