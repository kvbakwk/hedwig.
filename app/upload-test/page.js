"use client";

/**
 * Client Component Page: /upload-test (App Router)
 * 
 * This page provides a user interface to test the avatar image upload functionality
 * using the Next.js App Router. It sends requests to the Route Handler at
 * `/api/upload-avatar`, which, in this demonstration, saves files to the server's
 * local file system.
 * 
 * Important Note on Storage Backend:
 * The corresponding API Route Handler (`/app/api/upload-avatar/route.js`)
 * uses a local file system storage strategy. This is suitable for development and
 * basic testing but has significant limitations for production environments.
 * For detailed information on these limitations (related to scalability, data
 * durability, and serverless compatibility) and recommendations for production-ready
 * cloud storage solutions, please refer to the comments within the
 * `/app/api/upload-avatar/route.js` file.
 */
import { useState } from 'react';

export default function UploadTestClientPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage(''); // Clear message when new file is selected
    } else {
      setFile(null); // Clear file if selection is cancelled
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    setMessage('Uploading...');
    setUploadedImageUrl(''); // Clear previous image
    const formData = new FormData();
    formData.append('avatar', file); // 'avatar' is the field name expected by the backend

    try {
      const res = await fetch('/api/upload-avatar', { // This should target the App Router endpoint
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Upload successful!');
        setUploadedImageUrl(data.imageUrl);
      } else {
        setMessage(`Upload failed: ${data.error || res.statusText || 'Unknown error'}`);
        setUploadedImageUrl('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`Error uploading: ${error.message}`);
      setUploadedImageUrl('');
    }
  };

  return (
    <div>
      <h1>Avatar Upload Test (App Router)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit">Upload Avatar</button>
        </div>
      </form>
      {message && <p style={{ marginTop: '10px' }}>{message}</p>}
      {uploadedImageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Uploaded Image:</h2>
          <img src={uploadedImageUrl} alt="Uploaded avatar" style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '10px' }} />
        </div>
      )}
    </div>
  );
}
