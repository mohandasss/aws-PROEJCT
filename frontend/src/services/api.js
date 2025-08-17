import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
const S3_BUCKET_NAME = process.env.REACT_APP_S3_BUCKET_NAME;

// Upload file to S3
// Expects a file object and returns { message, fileUrl, key }
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// List all files in the S3 bucket
// Returns array of { key, url, lastModified, size }
export const listFiles = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files`);
    // The backend now returns the files array directly
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error('Error listing files:', error);
    // Return empty array on error to prevent UI breakage
    return [];
  }
};

// Get a signed URL for a file
// Expects a file key and returns the URL
export const getFileUrl = async (key) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/file/${key}`);
    return response.data.url || `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

// Delete a file from S3
export const deleteFile = async (key) => {
  try {
    console.log("Original key:", key);
    // Send the full key (with extension) to the backend
    const response = await axios.delete(`${API_BASE_URL}/file/${encodeURIComponent(key)}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};
