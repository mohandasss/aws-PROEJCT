const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1' // Change to your preferred region
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'my-demo-bucket-123';

module.exports = { s3, BUCKET_NAME };
