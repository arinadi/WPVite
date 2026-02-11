import type { VercelRequest, VercelResponse } from '@vercel/node';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, sql } from 'drizzle-orm';
import { users } from '../db/schema.js';
import { generateToken, setAuthCookie, clearAuthCookie } from '../lib/auth.js';

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

export const authController = {
    // GET /api/auth/google
    async google(_req: VercelRequest, res: VercelResponse) {
        const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
        authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
        authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', 'openid email profile');
        authUrl.searchParams.set('access_type', 'offline');
        authUrl.searchParams.set('prompt', 'consent');

        return res.redirect(authUrl.toString());
    },

    // GET /api/auth/callback
    async callback(req: VercelRequest, res: VercelResponse) {
        try {
            const { code } = req.query;

            if (!code || typeof code !== 'string') {
                return res.status(400).json({ error: 'Missing authorization code' });
            }

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

            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });

            if (!userInfoResponse.ok) {
                throw new Error('Failed to fetch user info');
            }

            const userInfo: GoogleUserInfo = await userInfoResponse.json();

            const dbSql = neon(process.env.DATABASE_URL!);
            const db = drizzle(dbSql, { schema: { users } });

            const userCount = await db
                .select({ count: sql<number>`count(*)` })
                .from(users);
            const isFirstUser = Number(userCount[0]?.count) === 0;

            let user = await db
                .select()
                .from(users)
                .where(eq(users.email, userInfo.email))
                .limit(1);

            if (user.length === 0) {
                if (!isFirstUser) {
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

                const newUser = await db
                    .insert(users)
                    .values({
                        email: userInfo.email,
                        googleId: userInfo.id,
                        name: userInfo.name,
                        avatarUrl: userInfo.picture,
                        role: 'super_admin',
                    } as any)
                    .returning();

                user = newUser;
            }

            const token = await generateToken({
                id: user[0].id,
                email: user[0].email,
                name: user[0].name || '',
                role: user[0].role,
            });

            setAuthCookie(res, token);
            const redirectUrl = isFirstUser ? '/admin/setup' : '/admin';
            return res.redirect(redirectUrl);
        } catch (error) {
            console.error('OAuth callback error:', error);
            return res.status(500).json({ error: 'Authentication failed' });
        }
    },

    // GET /api/auth/me
    async me(req: any, res: VercelResponse) { // req is AuthenticatedRequest
        if (!req.user) {
            return res.status(401).json({ error: 'Not authenticated' });
        }
        return res.json({ data: req.user });
    },

    // POST /api/auth/logout
    async logout(_req: VercelRequest, res: VercelResponse) {
        clearAuthCookie(res);
        return res.status(200).json({ success: true });
    }
};
