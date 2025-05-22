/**
 * Page: /upload-test
 * 
 * This page provides a user interface to test the avatar image upload functionality.
 * It demonstrates uploading an image to the Next.js API route `/api/upload-avatar`,
 * which currently saves images to the server's local file system.
 * 
 * Important Considerations (related to the backend API):
 * - The backend API (`/api/upload-avatar`) has significant limitations for production
 *   environments regarding file storage. It uses the local file system, which is not
 *   suitable for serverless deployments, poses data loss risks, and doesn't scale
 *   well for multi-instance setups.
 * - For detailed information on these limitations and recommended cloud storage
 *   alternatives, please refer to the comments in `pages/api/upload-avatar.js`.
 * 
 * This frontend component itself is straightforward and primarily handles:
 * - File selection using an `<input type="file">`.
 * - Form submission via `fetch` to the backend API.
 * - Displaying success/error messages and the uploaded image.
 */
import { useState } from 'react';

export default function UploadTestPage() {
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
      const res = await fetch('/api/upload-avatar', {
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
      <h1>Avatar Upload Test</h1>
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
