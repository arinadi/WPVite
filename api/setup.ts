import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { sql } from 'drizzle-orm';
import { users, options } from '../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../src/lib/withAuth';

// Initialize DB connection
const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Double check that we only allow setup if there is exactly ONE user (the super admin who just logged in)
    // AND that the options table is empty (or lacks site_title)
    
    // Check user count
    const userCountResult = await db.select({ count: sql<number>`count(*)` }).from(users);
    const userCount = Number(userCountResult[0]?.count);

    if (userCount !== 1) {
       return res.status(403).json({ error: 'Setup can only be run when there is exactly one user (the owner).' });
    }

    // Check if setup is already done
    const titleOption = await db.select().from(options).where(sql`key = 'site_title'`).limit(1);
    
    if (titleOption.length > 0) {
      return res.status(403).json({ error: 'Setup has already been completed.' });
    }

    const { siteTitle, tagline } = req.body;

    if (!siteTitle) {
      return res.status(400).json({ error: 'Site title is required' });
    }

    // 2. Save options
    await db.insert(options).values([
      { key: 'site_title', value: siteTitle },
      { key: 'tagline', value: tagline || '' },
      { key: 'site_logo', value: '' }, // Default empty
    ]);

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error('Setup error:', error);
    return res.status(500).json({ error: 'Internal server error during setup' });
  }
}

// Protect the endpoint - only a logged in user (the super admin) can run it
export default withAuth(handler);
