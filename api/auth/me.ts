import type { VercelRequest, VercelResponse } from '@vercel/node';
import { withAuth, type AuthenticatedRequest } from '../../src/lib/withAuth';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  // User is already attached to request by withAuth middleware
  res.status(200).json({
    user: req.user
  });
}

export default withAuth(handler);
