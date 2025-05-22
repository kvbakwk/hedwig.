/**
 * API Route: /api/upload-avatar
 * 
 * Handles avatar image uploads.
 * 
 * Limitations and Future Considerations:
 * 1.  Local File System Storage: This implementation saves uploaded images directly to the
 *     server's local file system (`public/uploads/avatars`). While straightforward for
 *     development or small, single-instance deployments, it has significant limitations
 *     for production and scaling:
 *     a.  Serverless Incompatibility: Not suitable for serverless platforms (e.g., Vercel,
 *         Netlify) which often have ephemeral or read-only file systems. Uploads might
 *         be lost on subsequent requests or deployments.
 *     b.  Data Loss Risk: If the server instance crashes or is terminated, and no separate
 *         backup system is in place for the `public/uploads` directory, all uploaded
 *         images will be lost.
 *     c.  Scalability Issues: In a multi-instance backend setup (load balancing), an image
 *         uploaded to one instance will not be available on others, leading to
 *         inconsistent user experiences.
 * 2.  Cloud Storage Recommendation: For production environments, it is highly recommended
 *     to use a dedicated cloud storage service like Google Cloud Storage (GCS), AWS S3,
 *     or Cloudinary. These services offer:
 *     a.  Scalability: Handle large numbers of files and high traffic.
 *     b.  Durability: Data is typically replicated across multiple locations, reducing
 *         data loss risk.
 *     c.  Serving Efficiency: Often provide Content Delivery Network (CDN) integration
 *         for faster image delivery to users globally.
 *     d.  Decoupling: Separates file storage from your application server's lifecycle.
 * 
 * To adapt for production:
 * - Modify this handler to upload files to a cloud storage provider instead of the local fs.
 * - The `formidable` part can still be used to parse the multipart/form-data.
 * - Instead of `fs.renameSync`, use the cloud provider's SDK to upload the file stream
 *   or buffer from `anUploadedFile.filepath`.
 */
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        res.status(500).json({ error: 'Error parsing form data.' });
        return;
      }

      const file = files.avatar; // Assuming the file input field is named 'avatar'

      if (!file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }
      
      // Ensure file is an array and take the first element if it is
      const anUploadedFile = Array.isArray(file) ? file[0] : file;

      if (!anUploadedFile || !anUploadedFile.originalFilename) {
        res.status(400).json({ error: 'No file uploaded or filename is missing.' });
        return;
      }
      
      const uniqueFilename = Date.now() + '-' + anUploadedFile.originalFilename;
      const oldPath = anUploadedFile.filepath;
      const newPath = path.join(uploadDir, uniqueFilename);

      try {
        fs.renameSync(oldPath, newPath);
        const imageUrl = `/uploads/avatars/${uniqueFilename}`;
        res.status(200).json({ imageUrl });
      } catch (renameError) {
        console.error('Error renaming file:', renameError);
        // Attempt to remove the temporarily uploaded file if renaming failed
        try {
          fs.unlinkSync(oldPath);
        } catch (unlinkError) {
          console.error('Error deleting temporary file:', unlinkError);
        }
        res.status(500).json({ error: 'Error saving uploaded file.' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
