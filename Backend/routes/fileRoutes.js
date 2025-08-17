const express = require('express');
const router = express.Router();
const { uploadFile, listFiles, deleteFile, upload } = require('../controllers/fileController');

// Upload a file
router.post('/upload', upload.single('file'), uploadFile);

// List all files
router.get('/files', listFiles);

// Delete a file
router.delete('/file/:key', deleteFile);

module.exports = router;
