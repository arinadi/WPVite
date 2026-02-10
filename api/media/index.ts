import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc, sql } from 'drizzle-orm';
import { media } from '../../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { page = '1', limit = '20' } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const results = await db
      .select()
      .from(media)
      .orderBy(desc(media.uploadedAt))
      .limit(Number(limit))
      .offset(offset);

    // Get total count
    const countResult = await db.select({ count: sql<number>`count(*)` }).from(media);
    const total = Number(countResult[0]?.count || 0);

    return res.status(200).json({
      data: results,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get media error:', error);
    return res.status(500).json({ error: 'Failed to fetch media' });
  }
}

export default withAuth(handler);
