const { s3, S3_BUCKET_NAME } = require('../config/config');
const { v4: uuidv4 } = require('uuid');

// Helper: S3 key for a post
const getPostKey = (id) => `blog-posts/${id}.json`;

// Create a new blog post (store JSON in S3)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log('Creating post with title:', title);
    const imageUrl = req.imageUrl; // Set in route after S3 upload
    if (!title || !content || !imageUrl) {
      return res.status(400).json({ error: 'Title, content, and image are required' });
    }
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    const post = { id, title, content, imageUrl, createdAt };
    await s3.putObject({
      Bucket: S3_BUCKET_NAME,
      Key: getPostKey(id),
      Body: JSON.stringify(post),
      ContentType: 'application/json',
    }).promise();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};

// Get all posts (list and read all JSON files from S3)
exports.getAllPosts = async (req, res) => {
  try {
    const list = await s3.listObjectsV2({
      Bucket: S3_BUCKET_NAME,
      Prefix: 'blog-posts/'
    }).promise();
    const posts = await Promise.all(
      (list.Contents || []).map(async (obj) => {
        const data = await s3.getObject({ Bucket: S3_BUCKET_NAME, Key: obj.Key }).promise();
        return JSON.parse(data.Body.toString());
      })
    );
    // Sort by createdAt desc
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Get single post by id
exports.getPostById = async (req, res) => {
  try {
    const key = getPostKey(req.params.id);
    console.log(key);
    
    const data = await s3.getObject({ Bucket: S3_BUCKET_NAME, Key: key }).promise();
    const post = JSON.parse(data.Body.toString());
    res.json(post);
  } catch (err) {
    res.status(404).json({ error: 'Post not found' });
  }
};

// Delete post by id (delete JSON from S3)
exports.deletePost = async (req, res) => {
  try {
    const key = getPostKey(req.params.id);
    await s3.deleteObject({ Bucket: S3_BUCKET_NAME, Key: key }).promise();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
