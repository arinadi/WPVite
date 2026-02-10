import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { options } from '../../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';
import { sql } from 'drizzle-orm';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const allOptions = await db.select().from(options);
      
      // Convert array of {key, value} to object
      const optionsMap = allOptions.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string | null>);

      return res.status(200).json({ data: optionsMap });
    } catch (error) {
      console.error('Get options error:', error);
      return res.status(500).json({ error: 'Failed to fetch options' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      
      // Process updates in transaction-like manner (though HTTP is stateless)
      // Drizzle batch insert with "on conflict update" is good
      
      const updatePromises = Object.entries(updates).map(([key, value]) => {
        return db.insert(options)
          .values({ key, value: String(value) })
          .onConflictDoUpdate({ target: options.key, set: { value: String(value) } });
      });

      await Promise.all(updatePromises);

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Update options error:', error);
      return res.status(500).json({ error: 'Failed to update options' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
