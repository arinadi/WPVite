import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { options } from '../src/db/schema';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const db = drizzle(sql);

    // Test: Insert a seed option
    await db.insert(options).values({
      key: 'site_title',
      value: 'My WPVite Site',
    }).onConflictDoNothing();

    // Test: Read it back
    const result = await db.select().from(options);

    res.json({ status: 'ok', data: result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ status: 'error', message });
  }
}
