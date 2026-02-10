import { match } from 'path-to-regexp';

export type RouteType = 'home' | 'post' | 'page' | '404';

interface RouteResult {
  type: RouteType;
  params: any;
}

export function matchRoute(path: string): RouteResult {
  // Normalize path
  const normalizedPath = path.replace(/\/$/, '') || '/';

  // 1. Home
  if (normalizedPath === '/') {
    return { type: 'home', params: {} };
  }

  // 2. Post (/p/:slug)
  const postMatch = match('/p/:slug')(normalizedPath);
  if (postMatch) {
    return { type: 'post', params: postMatch.params };
  }

  // 3. Page (/:slug) - catch all for pages, but for now we might only have posts
  // Let's assume everything else is a page or 404.
  // For this MVP, let's treat top-level slugs as pages if we had pages, 
  // but we defined posts as /p/:slug to avoid collision. 
  // If we want WP style /:slug for posts, we would check DB.
  // For simplicity:
  
  return { type: '404', params: {} };
}
