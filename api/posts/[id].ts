import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import { posts } from '../../src/db/schema';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';
import slugify from 'slugify';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Post ID is required' });
  }

  if (req.method === 'GET') {
    try {
      const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
      
      if (result.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ data: result[0] });
    } catch (error) {
      console.error('Get post error:', error);
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, content, status, excerpt, featuredImage, allowComments, slug } = req.body;

      const updateData: any = {
        updatedAt: new Date(),
      };

      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (status !== undefined) updateData.status = status;
      if (excerpt !== undefined) updateData.excerpt = excerpt;
      if (featuredImage !== undefined) updateData.featuredImage = featuredImage;
      if (allowComments !== undefined) updateData.allowComments = allowComments;
      
      // Handle slug update if provided, otherwise regenerate from title if title changed
      if (slug) {
        updateData.slug = slugify(slug, { lower: true, strict: true });
      } else if (title) {
        // Optional: decide if we auto-update slug on title change logic. 
        // Usually better to only update slug if explicitly requested to avoid breaking links.
        // For now, let's keep slug stable unless explicitly changed.
      }

      const updatedPost = await db
        .update(posts)
        .set(updateData)
        .where(eq(posts.id, id))
        .returning();

      if (updatedPost.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ data: updatedPost[0] });
    } catch (error) {
      console.error('Update post error:', error);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedPost = await db.delete(posts).where(eq(posts.id, id)).returning();
      
      if (deletedPost.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.status(200).json({ success: true, id });
    } catch (error) {
      console.error('Delete post error:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
