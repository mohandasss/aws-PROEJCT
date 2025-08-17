import React, { useState, useEffect } from 'react';
import { listFiles, getFileUrl, deleteFile } from '../../services/api';
import './FileList.css';
import { FiDownload, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

const FileList = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const files = await listFiles();
      setFiles(Array.isArray(files) ? files : []);
      setError('');
    } catch (err) {
      console.error('Error fetching files:', err);
      setError('Failed to load files. Please try again later.');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const formatFileSize = (bytes) => {
    if (bytes === 0 || !bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    // Format to 1 decimal place for MB and above, 0 for KB
    const decimals = i >= 2 ? 1 : 0;
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return '📄';
    
    const extension = fileName.split('.').pop().toLowerCase();
    const fileIcons = {
      // Documents
      'pdf': '📄',
      'doc': '📝', 'docx': '📝',
      'txt': '📄', 'rtf': '📄',
      'odt': '📄', 'pages': '📄',
      
      // Spreadsheets
      'xls': '📊', 'xlsx': '📊',
      'csv': '📊', 'ods': '📊', 'numbers': '📊',
      
      // Presentations
      'ppt': '📑', 'pptx': '📑', 'key': '📑', 'odp': '📑',
      
      // Images
      'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 
      'gif': '🖼️', 'svg': '🖼️', 'webp': '🖼️',
      'bmp': '🖼️', 'tiff': '🖼️', 'heic': '🖼️',
      
      // Audio/Video
      'mp3': '🎵', 'wav': '🎵', 'ogg': '🎵', 'm4a': '🎵',
      'mp4': '🎥', 'mov': '🎥', 'avi': '🎥', 'mkv': '🎥',
      
      // Archives
      'zip': '🗄️', 'rar': '🗄️', '7z': '🗄️', 'tar': '🗄️', 
      'gz': '🗄️', 'bz2': '🗄️',
      
      // Code
      'js': '📜', 'jsx': '📜', 'ts': '📜', 'tsx': '📜',
      'html': '🌐', 'css': '🎨', 'json': '📋', 'md': '📝',
      'py': '🐍', 'java': '☕', 'c': '🔧', 'cpp': '🔧',
      'cs': '🔷', 'go': '🐹', 'php': '🐘', 'rb': '💎',
      'rs': '🦀', 'swift': '🐦', 'kt': '🔸', 'sh': '💻',
      
      // Common files
      'exe': '⚙️', 'dmg': '💾', 'pkg': '📦', 'apk': '📱',
      'iso': '💿', 'sql': '🗃️', 'db': '🗃️', 'log': '📋',
    };
    
    return fileIcons[extension] || '📄';
  };

  // Check if file is an image
  const isImage = (fileName) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const extension = fileName.split('.').pop().toLowerCase();
    return imageExtensions.includes(extension);
  };

  // Handle download or view
  const handleDownload = (url, fileName, isImage) => {
    if (isImage) {
      // For images, open in new tab
      window.open(url, '_blank');
    } else {
      // For other files, trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Handle delete
  const handleDelete = async (fileKey, index) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      try {
        setDeletingId(index);
        console.log(fileKey);
        await deleteFile(fileKey);
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        toast.success('File deleted successfully!');
      } catch (err) {
        console.error('Error deleting file:', err);
        setError('Failed to delete file. Please try again.');
        toast.error('Failed to delete file. Please try again.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="file-list">
      <h2>Uploaded Files</h2>
      {loading ? (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <span>Loading files...</span>
        </div>
      ) : error ? (
        <p className="error">{error}</p>
      ) : files.length === 0 ? (
        <div className="empty-state">
          <p>No files have been uploaded yet.</p>
          <p>Upload your first file using the form above.</p>
        </div>
      ) : (
        <div className="files-container">
          {files.map((file, index) => {
            const fileName = file.key || '';
            const fileSize = file.size || 0;
            const fileUrl = file.url || `https://${process.env.REACT_APP_S3_BUCKET_NAME}.s3.amazonaws.com/${file.key}`;
            const fileKey = file.key || fileName; // Use the key from the file object
            const displayName = fileName.split('/').pop();
            
            return (
              <div key={index} className="file-item">
                <div className="file-preview">
                  {isImage(fileName) ? (
                    <div className="image-container">
                      <img 
                        src={fileUrl} 
                        alt={displayName} 
                        className="thumbnail"
                        onClick={() => window.open(fileUrl, '_blank')}
                      />
                    </div>
                  ) : (
                    <div className="file-icon">{getFileIcon(fileName)}</div>
                  )}
                </div>
                <div className="file-info">
                  <div className="file-header">
                    <a 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="file-name"
                      title={displayName}
                    >
                      {displayName}
                    </a>
                    <div className="file-actions">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          const isImageFile = isImage(fileName);
                          handleDownload(fileUrl, fileName, isImageFile);
                        }}
                        className="action-btn download-btn"
                        title={isImage(fileName) ? 'View image' : 'Download file'}
                        disabled={deletingId === index}
                      >
                        {isImage(fileName) ? '👁️' : <FiDownload />}
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pass the file key to handleDelete
                          handleDelete(fileKey, index);
                        }}
                        className="action-btn delete-btn"
                        title="Delete file"
                        disabled={deletingId === index}
                      >
                        {deletingId === index ? '...' : <FiTrash2 />}
                      </button>
                    </div>
                  </div>
                  <div className="file-meta">
                    <span className="file-size">{formatFileSize(fileSize)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FileList;
