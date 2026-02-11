import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import { posts, users } from '../db/schema';
import slugify from 'slugify';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

export const postsController = {
    // GET /api/posts
    async list(req: VercelRequest, res: VercelResponse) {
        try {
            const { status, page = '1', limit = '10' } = req.query;
            const offset = (Number(page) - 1) * Number(limit);

            let query = db
                .select({
                    id: posts.id,
                    title: posts.title,
                    slug: posts.slug,
                    status: posts.status,
                    updatedAt: posts.updatedAt,
                    authorName: users.name,
                    authorAvatar: users.avatarUrl,
                })
                .from(posts)
                .leftJoin(users, eq(posts.authorId, users.id))
                .orderBy(desc(posts.updatedAt))
                .limit(Number(limit))
                .offset(offset);

            if (status && typeof status === 'string' && status !== 'all') {
                // @ts-ignore
                query = query.where(eq(posts.status, status));
            }

            const results = await query;
            const countResult = await db.select({ count: sql<number>`count(*)` }).from(posts);
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
            console.error('Get posts error:', error);
            return res.status(500).json({ error: 'Failed to fetch posts' });
        }
    },

    // POST /api/posts
    async create(req: any, res: VercelResponse) {
        try {
            const { title, content, status, excerpt, featuredImage, allowComments } = req.body;

            if (!title) {
                return res.status(400).json({ error: 'Title is required' });
            }

            let slug = slugify(title, { lower: true, strict: true });
            const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
            if (existing.length > 0) {
                slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
            }

            const newPost = await db
                .insert(posts)
                .values({
                    title,
                    slug,
                    content: content || [],
                    status: status || 'draft',
                    excerpt: excerpt || '',
                    featuredImage: featuredImage || null,
                    allowComments: allowComments ?? true,
                    authorId: req.user!.id,
                })
                .returning();

            return res.status(201).json({ data: newPost[0] });
        } catch (error) {
            console.error('Create post error:', error);
            return res.status(500).json({ error: 'Failed to create post' });
        }
    },

    // GET /api/posts/:id
    async get(req: VercelRequest, res: VercelResponse) {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Post ID is required' });

        try {
            const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
            if (result.length === 0) return res.status(404).json({ error: 'Post not found' });
            return res.status(200).json({ data: result[0] });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to fetch post' });
        }
    },

    // PUT /api/posts/:id
    async update(req: any, res: VercelResponse) {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Post ID is required' });

        try {
            const { title, content, status, excerpt, featuredImage, allowComments, slug } = req.body;
            const updateData: any = { updatedAt: new Date() };

            if (title !== undefined) updateData.title = title;
            if (content !== undefined) updateData.content = content;
            if (status !== undefined) updateData.status = status;
            if (excerpt !== undefined) updateData.excerpt = excerpt;
            if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
            if (allowComments !== undefined) updateData.allowComments = allowComments;
            if (slug) updateData.slug = slugify(slug, { lower: true, strict: true });

            const updatedPost = await db.update(posts).set(updateData).where(eq(posts.id, id)).returning();
            if (updatedPost.length === 0) return res.status(404).json({ error: 'Post not found' });

            return res.status(200).json({ data: updatedPost[0] });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update post' });
        }
    },

    // DELETE /api/posts/:id
    async delete(req: VercelRequest, res: VercelResponse) {
        const { id } = req.query;
        if (!id || typeof id !== 'string') return res.status(400).json({ error: 'Post ID is required' });

        try {
            const deletedPost = await db.delete(posts).where(eq(posts.id, id)).returning();
            if (deletedPost.length === 0) return res.status(404).json({ error: 'Post not found' });
            return res.status(200).json({ success: true, id });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to delete post' });
        }
    }
};
