import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { media } from '../../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

// Note: Vercel Blob upload is typically done from client-side for big files, 
// or via server-side for smaller ones. For simplicity in this Admin SPA, 
// we'll handle the upload on the client mostly, but here is a server-side proxy 
// capability OR we can just use this to record the metadata after client upload.
// HOWEVER, standard pattern is: Client uploads to Blob -> Returns URL -> Client calls API to save metadata.
// OR: Client sends file to this API -> This API uploads to Blob -> Saves metadata.
// We will use the second approach (Server-side upload) for better control in this phase.

// Vercel Functions have 4.5MB limit for request body. For larger files, client-side upload is needed.
// For this phase, we assume files < 4.5MB or we implement client-side upload later.
// Actually, using @vercel/blob `handleUpload` is best for client uploads, 
// but let's stick to a simple server-side proxy for now for simplicity if file size permits, 
// or mostly, we will assume the client sends a `url` if they uploaded directly, 
// OR they send the file content. 

// Let's implement the "Upload to Blob" here.
// But reading multipart/form-data in Vercel Node function requires parsing.
// To keep it simple without heavy parsers, we will assume the client 
// sends JSON with file name and base64 content OR we use a client-side upload token pattern.

// REVISED PLAN: 
// 1. We will use the `put` method from `@vercel/blob` which works server-side.
// We will expect the request body to be the file content binary if possible, 
// but passing binary via fetch can be tricky with Vercel types.
// EASIEST: Client performs `put` to Vercel Blob directly using a client token (safe? no).
// SAFE: Server generates a SAS/Client Token? Vercel Blob has `handleUpload`.

// Let's use the simplest robust path:
// 1. Client sends POST to this endpoint with filename and contentType.
// 2. This endpoint returns a `handleUpload` client token or performs the upload if payload is small.

// ACTUALLY, checking the docs: @vercel/blob `put` can be used on server.
// Let's rely on valid `BLOB_READ_WRITE_TOKEN` env var being present.

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      // For simplicity, we'll try to handle the upload here if the user sends query params for filename
      // and the body is the file. 
      const filename = req.query.filename as string || 'uploaded-file';
      
      // NOTE: Accessing raw body in Vercel functions varies.
      // If we use standard `fetch` from client with body=File, it's a stream.
      // @vercel/blob `put` accepts a ReadableStream, UserFiles, etc.
      
      const blob = await put(filename, req.body, {
        access: 'public',
      });

      // Save to DB
      const newMedia = await db.insert(media).values({
        url: blob.url,
        type: blob.contentType,
        altText: '',
      }).returning();

      return res.status(201).json({ data: newMedia[0] });

    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload file' });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
