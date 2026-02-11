import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { options } from '../db/schema.js';
import type { AuthenticatedRequest } from '../lib/withAuth.js';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

export const optionsController = {
    async list(_req: VercelRequest, res: VercelResponse) {
        try {
            const allOptions = await db.select().from(options);
            const optionsMap = allOptions.reduce((acc, curr) => {
                acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string | null>);
            return res.status(200).json({ data: optionsMap });
        } catch (error) {
            console.error('Get options error:', error);
            return res.status(500).json({ error: 'Failed to fetch options' });
        }
    },

    async update(req: AuthenticatedRequest, res: VercelResponse) {
        try {
            const updates = req.body;
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
};
