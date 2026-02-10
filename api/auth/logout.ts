import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAuthCookie } from '../../src/lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  clearAuthCookie(res);
  res.status(200).json({ success: true });
}
