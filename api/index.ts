import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql } from 'drizzle-orm';
import { posts, options, users } from '../src/db/schema';
import { matchRoute } from '../src/lib/router';
import { renderPage } from '../src/lib/renderer';

const sqlConn = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConn);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Skip API routes and static files handled by updates to vercel.json
  // But vercel.json rewrites should point here for everything else.

  const url = req.url || '/';
  const { type, params } = matchRoute(url);

  try {
    // 1. Fetch Global Site Options (Title, Tagline, etc)
    const allOptions = await db.select().from(options);
    const siteOptions = allOptions.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, any>);

    let data: any = {};

    // 2. Fetch Content based on Route
    if (type === 'home') {
      // Fetch latest posts
      const latestPosts = await db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          featuredImage: posts.featuredImage,
          updatedAt: posts.updatedAt,
          authorName: users.name,
          authorAvatar: users.avatarUrl,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.status, 'published')) // Only published
        .limit(10); // Simple pagination later
      
      data = { posts: latestPosts };
    } 
    else if (type === 'post') {
      const slug = params.slug;
      const post = await db
        .select({
          id: posts.id,
          title: posts.title,
          content: posts.content,
          featuredImage: posts.featuredImage,
          updatedAt: posts.updatedAt,
          authorName: users.name,
          authorAvatar: users.avatarUrl,
        })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(eq(posts.slug, slug))
        .limit(1);

      if (post.length === 0) {
        // 404
        return res.status(404).send('Not Found'); // Needs pretty 404
      }
      
      data = { post: post[0] };
    }
    else if (type === '404') {
      return res.status(404).send('Not Found');
    }

    // 3. Render
    const html = await renderPage(url, type, data, siteOptions);

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
    return res.status(200).send(html);

  } catch (error) {
    console.error('SSR Error:', error);
    return res.status(500).send('Internal Server Error');
  }
}
