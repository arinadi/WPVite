import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { desc, sql, eq } from 'drizzle-orm';
import { media } from '../db/schema.js';
import { put, del } from '@vercel/blob';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

export const mediaController = {
    // GET /api/media
    async list(req: VercelRequest, res: VercelResponse) {
        try {
            const { page = '1', limit = '20' } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            const results = await db
                .select()
                .from(media)
                .orderBy(desc(media.uploadedAt))
                .limit(Number(limit))
                .offset(offset);

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
            } as any);
        } catch (error) {
            console.error('Get media error:', error);
            return res.status(500).json({ error: 'Failed to fetch media' });
        }
    },

    // POST /api/media/upload
    async upload(req: VercelRequest, res: VercelResponse) {
        try {
            const filename = req.query.filename as string || 'uploaded-file';

            const blob = await put(filename, req.body, {
                access: 'public',
            });

            const newMedia = await db.insert(media).values({
                url: blob.url,
                type: blob.contentType,
                altText: '',
            } as any).returning();

            return res.status(201).json({ data: newMedia[0] });
        } catch (error) {
            console.error('Upload error:', error);
            return res.status(500).json({ error: 'Failed to upload file' });
        }
    },

    // DELETE /api/media/:id
    async delete(req: VercelRequest, res: VercelResponse) { // id extraction handled by router
        const { id } = req.query; // Actually router should pass params? Or we rely on query params? 
        // In Vercel, dynamic routes passed as query params like `req.query.id`.
        // But since we are routing everything to `api/v1`, we'll need to parse the URL or use our router to inject params.
        // For now, let's assume our router injects params into req.query or we parse it.

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'Media ID is required' });
        }

        try {
            const mediaRecord = await db.select().from(media).where(eq(media.id, id)).limit(1);

            if (mediaRecord.length === 0) {
                return res.status(404).json({ error: 'Media not found' });
            }

            await del(mediaRecord[0].url);
            await db.delete(media).where(eq(media.id, id));

            return res.status(200).json({ success: true });
        } catch (error) {
            console.error('Delete media error:', error);
            return res.status(500).json({ error: 'Failed to delete media' });
        }
    }
};
