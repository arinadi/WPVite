import type { VercelRequest, VercelResponse } from '@vercel/node';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_REDIRECT_URI = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/auth/callback`
  : 'http://localhost:3000/api/auth/callback';

/**
 * OAuth initiation endpoint
 * Redirects user to Google consent screen
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');

  authUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
  authUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid email profile');
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  res.redirect(authUrl.toString());
}
