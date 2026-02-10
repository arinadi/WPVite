import { SignJWT, jwtVerify } from 'jose';
import type { VercelResponse } from '@vercel/node';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-change-me');
const JWT_EXPIRY = '7d'; // 7 days

export interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Generate a JWT token for the given user
 */
export async function generateToken(user: UserPayload): Promise<string> {
  const token = await new SignJWT(user as unknown as any)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Set authentication cookie in response
 */
export function setAuthCookie(res: VercelResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production';

  res.setHeader('Set-Cookie', [
    `auth_token=${token}; HttpOnly; Secure=${isProduction}; SameSite=Lax; Path=/; Max-Age=604800`,
  ]);
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(res: VercelResponse): void {
  res.setHeader('Set-Cookie', [
    'auth_token=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0',
  ]);
}

/**
 * Get auth token from request cookies
 */
export function getAuthToken(cookieHeader?: string): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies.auth_token || null;
}
