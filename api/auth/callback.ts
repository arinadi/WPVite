import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql } from 'drizzle-orm';
import { users } from '../../src/db/schema';
import { generateToken, setAuthCookie } from '../../src/lib/auth';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const GOOGLE_REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth/callback`
  : 'http://localhost:3000/api/auth/callback';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  id_token: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture: string;
}

/**
 * OAuth callback endpoint
 * Handles Google callback, exchanges code for token, creates session
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { code } = req.query;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing authorization code' });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // Fetch user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    // Connect to database
    const dbSql = neon(process.env.DATABASE_URL!);
    const db = drizzle(dbSql, { schema: { users } });

    // Check if users table is empty (first run)
    const userCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);
    const isFirstUser = Number(userCount[0]?.count) === 0;

    // Check if user exists
    let user = await db
      .select()
      .from(users)
      .where(eq(users.email, userInfo.email))
      .limit(1);

    if (user.length === 0) {
      // User doesn't exist
      if (!isFirstUser) {
        // Not first user and not in allowlist
        return res.status(403).send(`
          <!DOCTYPE html>
          <html>
            <head><title>Access Denied</title></head>
            <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center;">
              <h1>⛔ Access Denied</h1>
              <p>Your email (${userInfo.email}) is not authorized to access this site.</p>
              <p>Please contact the site administrator to request access.</p>
              <a href="/admin/login">← Back to Login</a>
            </body>
          </html>
        `);
      }

      // First user - create as super admin
      const newUser = await db
        .insert(users)
        .values({
          email: userInfo.email,
          googleId: userInfo.id,
          name: userInfo.name,
          avatarUrl: userInfo.picture,
          role: 'super_admin',
        })
        .returning();

      user = newUser;
    }

    // Generate JWT
    const token = await generateToken({
      id: user[0].id,
      email: user[0].email,
      name: user[0].name || '',
      role: user[0].role,
    });

    // Set cookie
    setAuthCookie(res, token);

    // Redirect to admin (or setup if first user)
    const redirectUrl = isFirstUser ? '/admin/setup' : '/admin';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}
