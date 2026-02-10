import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, desc, sql } from 'drizzle-orm';
import { posts, users } from '../../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';
import slugify from 'slugify';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // List posts
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
        // @ts-ignore - status type check
        query = query.where(eq(posts.status, status));
      }

      const results = await query;
      
      // Get total count for pagination
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
  }

  if (req.method === 'POST') {
    // Create post
    try {
      const { title, content, status, excerpt, featuredImage, allowComments } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // Generate slug
      let slug = slugify(title, { lower: true, strict: true });
      
      // Check for slug collision and append random string if needed
      const existing = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
      if (existing.length > 0) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
      }

      const newPost = await db
        .insert(posts)
        .values({
          title,
          slug,
          content: content || [], // BlockNote JSON
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
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
