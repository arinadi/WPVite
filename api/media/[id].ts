import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { media } from '../../src/db/schema';
import { del } from '@vercel/blob';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'DELETE') {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Media ID is required' });
    }

    try {
      // Get media record first to get URL
      const mediaRecord = await db.select().from(media).where(eq(media.id, id)).limit(1);
      
      if (mediaRecord.length === 0) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Delete from Vercel Blob
      await del(mediaRecord[0].url);

      // Delete from DB
      await db.delete(media).where(eq(media.id, id));

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Delete media error:', error);
      return res.status(500).json({ error: 'Failed to delete media' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
