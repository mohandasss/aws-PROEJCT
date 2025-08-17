const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const postsController = require('../controllers/postsController');

// Multer config: store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// AWS S3 config
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// POST /api/posts (with image upload)
router.post('/', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Image is required' });
    // Debug: log file info and env
    console.log('Uploading image to S3:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      bucket: process.env.S3_BUCKET_NAME,
      region: process.env.AWS_REGION,
      accessKey: process.env.AWS_ACCESS_KEY_ID ? 'set' : 'not set',
      secretKey: process.env.AWS_SECRET_ACCESS_KEY ? 'set' : 'not set',
    });
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `blog-images/${Date.now()}_${path.basename(req.file.originalname)}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };
    const s3Result = await s3.upload(params).promise();
    req.imageUrl = s3Result.Location;
    next();
  } catch (err) {
    console.error('S3 upload error:', err);
    res.status(500).json({ error: 'Failed to upload image to S3', details: err.message });
  }
}, postsController.createPost);

// GET all posts
router.get('/', postsController.getAllPosts);

// GET single post
router.get('/:id', postsController.getPostById);

// DELETE post
router.delete('/:id', postsController.deletePost);

module.exports = router;
