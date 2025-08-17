const { s3, BUCKET_NAME } = require('../config/s3Config');
const multer = require('multer');

// Configure multer for memory storage (file will be in memory before uploading to S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload file to S3
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a structured path with date
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    // Create a clean filename by removing special characters
    const cleanFileName = req.file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    
    // Create a structured key
    const key = `uploads/${year}/${month}/${day}/${Date.now()}_${cleanFileName}`;

    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      // Removed ACL to use bucket policies instead
    };

    const result = await s3.upload(params).promise();
    
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: result.Location,
      key: result.Key,
      size: req.file.size,
      lastModified: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Error uploading file to S3', details: error.message });
  }
};

// List all files in the S3 bucket
const listFiles = async (req, res) => {
  try {
    console.log('Listing files from S3 bucket:', BUCKET_NAME);
    
    // List all objects in the bucket
    const params = {
      Bucket: BUCKET_NAME,
      MaxKeys: 1000 // Increase limit to get more files
    };

    console.log('S3 listObjectsV2 params:', JSON.stringify(params, null, 2));
    
    const data = await s3.listObjectsV2(params).promise();
    console.log('S3 listObjectsV2 response:', JSON.stringify({
      KeyCount: data.KeyCount,
      IsTruncated: data.IsTruncated,
      Contents: data.Contents ? data.Contents.length : 0
    }, null, 2));
    
    if (!data.Contents || data.Contents.length === 0) {
      console.log('No files found in the S3 bucket');
      return res.status(200).json([]);
    }
    
    // Map all files
    const files = data.Contents
      .filter(file => !file.Key.endsWith('/')) // Exclude directory markers
      .map(file => ({
        key: file.Key,
        url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'ap-south-1'}.amazonaws.com/${file.Key}`,
        lastModified: file.LastModified,
        size: file.Size,
        storageClass: file.StorageClass
      }));
      
    console.log(`Returning ${files.length} files`);

    res.status(200).json(files);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Error listing files from S3', details: error.message });
  }
};

// Delete a file from S3
const deleteFile = async (req, res) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({ error: 'File key is required' });
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
    
    res.status(200).json({ 
      success: true, 
      message: 'File deleted successfully',
      key: key
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting file from S3', 
      details: error.message 
    });
  }
};

module.exports = {
  uploadFile,
  listFiles,
  deleteFile,
  upload // Export the multer middleware for use in routes
};
