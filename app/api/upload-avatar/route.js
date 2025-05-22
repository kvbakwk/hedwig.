/**
 * App Router API Route Handler: /api/upload-avatar
 * 
 * Handles avatar image uploads for the Next.js App Router.
 * 
 * Storage Method: Local File System
 * This Route Handler saves uploaded images directly to the server's local file system
 * in the `public/uploads/avatars` directory. This approach is primarily intended for
 * development purposes, testing, or very small, single-instance deployments.
 * 
 * Limitations for Production and Scalability:
 * 1.  Serverless Incompatibility: Not suitable for serverless deployment platforms
 *     (e.g., Vercel, Netlify). These platforms often have ephemeral or read-only
 *     file systems, meaning uploaded files may be lost between deployments or even
 *     between serverless function invocations.
 * 2.  Data Loss Risk: If the server instance crashes, is terminated, or if the
 *     `public/uploads` directory is not part of a persistent storage solution and
 *     regular backup routine, all uploaded images can be permanently lost.
 * 3.  Scalability Issues: When scaling the application to multiple backend instances
 *     (e.g., using load balancing), an image uploaded to one instance will only be
 *     available on that specific instance's file system. This leads to inconsistencies,
 *     as requests routed to other instances will not find the image, resulting in
 *     broken image links for users.
 * 
 * Recommendation for Production: Cloud Object Storage
 * For production applications, it is strongly recommended to use a cloud-based
 * object storage service such as:
 *   - Google Cloud Storage (GCS)
 *   - Amazon S3 (AWS S3)
 *   - Azure Blob Storage
 * These services offer robust solutions for scalability, data durability (through
 * replication and versioning), and often better performance for serving assets (e.g., via CDNs).
 * 
 * When using cloud storage:
 * - This Route Handler would be modified to stream/upload the file to the chosen
 *   cloud provider using their SDK.
 * - The `formidable` library can still be used to parse the incoming `FormData`.
 * - The `imageUrl` returned by this handler would then point to the URL of the
 *   image hosted on the cloud storage service.
 */
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';

// Define the upload directory
const uploadDir = path.join(process.cwd(), 'public/uploads/avatars');

// Promisify formidable.parse
const formidableParse = (req, form) =>
  new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export async function POST(req) {
  try {
    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    
    // Note: formidable expects a Node.js IncomingMessage.
    // For App Router, req is a NextRequest. This direct parsing might work
    // if formidable internally handles it or if the NextRequest stream is compatible.
    // If not, we might need to adapt 'req' (e.g., by piping req.body)
    // This is a common challenge when integrating libraries expecting Node req with Next.js App Router.
    const { fields, files } = await formidableParse(req, form);

    const file = files.avatar; // Assuming the file input field is named 'avatar'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Ensure file is an array and take the first element if it is
    const anUploadedFile = Array.isArray(file) ? file[0] : file;

    if (!anUploadedFile || !anUploadedFile.originalFilename) {
      return NextResponse.json({ error: 'No file uploaded or filename is missing.' }, { status: 400 });
    }

    const uniqueFilename = Date.now() + '-' + anUploadedFile.originalFilename;
    const oldPath = anUploadedFile.filepath;
    const newPath = path.join(uploadDir, uniqueFilename);

    await fs.rename(oldPath, newPath);

    const imageUrl = `/uploads/avatars/${uniqueFilename}`;
    return NextResponse.json({ imageUrl }, { status: 200 });

  } catch (error) {
    console.error('Upload error:', error);
    // Check if the error is from formidable (e.g., parsing error)
    if (error.message.includes('Invalid Formidable options')) { // Example check
        return NextResponse.json({ error: 'Error parsing form data. Check server logs for formidable issues.' }, { status: 500 });
    }
    // Attempt to clean up if a temporary file was created by formidable before an error occurred
    if (error.oldPath && typeof error.oldPath === 'string') {
      try {
        await fs.unlink(error.oldPath);
      } catch (unlinkError) {
        console.error('Error deleting temporary file during error handling:', unlinkError);
      }
    }
    return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
  }
}
