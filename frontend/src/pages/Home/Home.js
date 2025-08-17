import React, { useState } from 'react';
import FileUpload from '../../components/FileUpload/FileUpload';
import FileList from '../../components/FileList/FileList';
import './Home.css';

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Increment the key to force FileList to re-render
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="home">
      <header className="header">
        <h1>File Upload to AWS S3</h1>
        <p>Upload and manage your files securely</p>
      </header>
      
      <main className="main-content">
        <div className="upload-section">
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>
        
        <div className="files-section">
          <FileList key={refreshKey} />
        </div>
      </main>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} File Upload App</p>
      </footer>
    </div>
  );
};

export default Home;
