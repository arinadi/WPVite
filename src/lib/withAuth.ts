import type { VercelRequest, VercelResponse } from '@vercel/node';
import { verifyToken, getAuthToken, type UserPayload } from './auth';

export interface AuthenticatedRequest extends VercelRequest {
  user?: UserPayload;
}

export type AuthHandler = (
  req: AuthenticatedRequest,
  res: VercelResponse
) => Promise<any> | any;

/**
 * Middleware to protect API endpoints with authentication
 * Extracts JWT from cookie, verifies it, and attaches user to request
 */
export function withAuth(handler: AuthHandler) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      const token = getAuthToken(req.headers.cookie);

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      const user = await verifyToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Attach user to request
      (req as AuthenticatedRequest).user = user;

      // Call the actual handler
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}
