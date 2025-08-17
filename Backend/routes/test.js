const express = require('express');
const router = express.Router();

// Simple test endpoint
router.get('/test', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Backend API is working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
