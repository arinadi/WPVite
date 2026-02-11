import type { VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc } from 'drizzle-orm';
import { users } from '../db/schema.js';
import type { AuthenticatedRequest } from '../lib/withAuth.js';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

export const usersController = {
    async list(req: AuthenticatedRequest, res: VercelResponse) {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        try {
            const allUsers = await db.select().from(users).orderBy(desc(users.id));
            return res.status(200).json({ data: allUsers });
        } catch (error) {
            console.error('Get users error:', error);
            return res.status(500).json({ error: 'Failed to fetch users' });
        }
    },

    async create(req: AuthenticatedRequest, res: VercelResponse) {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        try {
            const { email, name, role } = req.body;
            if (!email) return res.status(400).json({ error: 'Email is required' });

            const newUser = await db.insert(users).values({
                email,
                name: name || '',
                role: role || 'author',
            }).returning();

            return res.status(201).json({ data: newUser[0] });
        } catch (error) {
            console.error('Add user error:', error);
            return res.status(500).json({ error: 'Failed to add user' });
        }
    },

    async delete(req: AuthenticatedRequest, res: VercelResponse) {
        if (req.user?.role !== 'super_admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        try {
            const { id } = req.query;
            if (!id || typeof id !== 'string') return res.status(400).json({ error: 'User ID is required' });

            if (id === req.user?.id) {
                return res.status(400).json({ error: 'Cannot delete yourself' });
            }

            await db.delete(users).where(eq(users.id, id));
            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Delete user error:', error);
            return res.status(500).json({ error: 'Failed to delete user' });
        }
    }
};
