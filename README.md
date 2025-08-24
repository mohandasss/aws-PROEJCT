📂 File Upload & Management System

A full-stack web application that allows users to securely upload, view, download, and delete files (PDF, DOCX, images, etc.) using AWS S3 for storage.

The project uses:

⚛️ React (Vite) – Frontend (hosted on Vercel)

🟢 Node.js + Express – Backend API (hosted on Render)

☁️ Amazon S3 – Cloud storage for uploaded files

✨ Features

📤 Upload files to AWS S3

📑 List all uploaded files with name, type, and size

⬇️ Download files from S3

❌ Delete files from S3

🔒 Secure file handling using AWS IAM credentials

🌐 Fully deployed (frontend on Vercel, backend on Render)

🏗️ Architecture
Frontend (React, Vercel) → Backend (Node.js/Express, Render) → Amazon S3 (Storage)


Frontend – Upload form + file manager UI

Backend – REST API (/upload, /files, /download/:key, /delete/:key)

AWS S3 – Stores files in bucket blog-bucketss

🚀 Deployment Links
 live - https://aws-proejct.vercel.app/

⚡ Tech Stack

Frontend: React, Axios

Backend: Node.js, Express, Multer, AWS SDK

Cloud: Amazon S3, IAM

Hosting: Vercel (Frontend), Render (Backend)


🔹 2. Setup Backend
cd backend
npm install



Start server:

npm start

🔹 3. Setup Frontend
cd frontend
npm install
npm run dev

📡 API Endpoints
Method	Endpoint	Description
POST	/upload	Upload a file to S3
GET	/files	List all files in S3
GET	/download/:key	Download a file
DELETE	/delete/:key	Delete a file from S3


🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
