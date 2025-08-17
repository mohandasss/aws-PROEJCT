import React, { useState } from 'react';
import { uploadFile } from '../../services/api';
import { toast } from 'react-toastify';
import './FileUpload.css';

const FileUpload = ({ onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    // Check file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size should be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      setError('');
      
      const result = await uploadFile(selectedFile);
      console.log('Upload successful:', result);
      
      // Reset form and update file list
      setSelectedFile(null);
      e.target.reset();
      
      // Call the success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess();
      }
      toast.success('File uploaded successfully!');

    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Error uploading file. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="file"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <p className="file-info">
            {selectedFile 
              ? `Selected: ${selectedFile.name} (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`
              : 'Max file size: 10MB'}
          </p>
        </div>
        {error && <p className="error">{error}</p>}
        <div className="button-container">
          <button
            type="submit"
            className="upload-button"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? (
              <>
                <span className="spinner"></span>
                Uploading...
              </>
            ) : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FileUpload;
