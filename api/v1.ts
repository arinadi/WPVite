import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Router } from '../src/lib/api-router';
import { authController } from '../src/controllers/auth';
import { mediaController } from '../src/controllers/media';
import { postsController } from '../src/controllers/posts';
import { usersController } from '../src/controllers/users';
import { optionsController } from '../src/controllers/options';
import { setupController } from '../src/controllers/setup';
import { withAuth } from '../src/lib/withAuth';

const router = new Router();

// Auth
router.get('/api/auth/google', authController.google);
router.get('/api/auth/callback', authController.callback);
router.get('/api/auth/me', withAuth(authController.me));
router.post('/api/auth/logout', authController.logout);

// Media
router.get('/api/media', withAuth(mediaController.list));
router.post('/api/media/upload', withAuth(mediaController.upload));
router.delete('/api/media/:id', withAuth(mediaController.delete));

// Posts
router.get('/api/posts', withAuth(postsController.list));
router.post('/api/posts', withAuth(postsController.create));
router.get('/api/posts/:id', withAuth(postsController.get));
router.put('/api/posts/:id', withAuth(postsController.update));
router.delete('/api/posts/:id', withAuth(postsController.delete));

// Users
router.get('/api/users', withAuth(usersController.list));
router.post('/api/users', withAuth(usersController.create));
router.delete('/api/users', withAuth(usersController.delete));

// Options
router.get('/api/options', withAuth(optionsController.list)); // Setup page needs this without auth? 
// Original api/options/index.ts was protected by withAuth.
// But if user is not logged in, setup page might need to check if site config exists?
// api/setup.ts handles logic to check if setup is done.
// Admin UI uses /api/options to get "site_title" etc.
// Keep it protected.

router.put('/api/options', withAuth(optionsController.update));

// Setup
router.post('/api/setup', withAuth(setupController.setup));

export default async function handler(req: VercelRequest, res: VercelResponse) {
    return router.handle(req, res);
}
