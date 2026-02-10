# Phase 5: Optimization & PWA

> **Objective:** Optimize performance with caching headers, configure PWA capabilities, polish the Admin UI, and finalize documentation.

---

## Prerequisites

| Item | Detail |
|---|---|
| **Phase 4** | Completed — Public SSR rendering fully functional |
| **All Features** | Posts, Media, Settings, Themes, Comments working |

---

## 5.1 — Caching Headers & Performance

### Tasks

- [ ] Configure `Cache-Control` headers per route:

  | Route | Cache Strategy | Header |
  |---|---|---|
  | `/` (Home) | Short cache, revalidate | `s-maxage=60, stale-while-revalidate=300` |
  | `/p/:slug` (Post) | Long cache, revalidate | `s-maxage=3600, stale-while-revalidate=86400` |
  | `/page/:slug` (Page) | Long cache, revalidate | `s-maxage=3600, stale-while-revalidate=86400` |
  | `/api/*` (Admin API) | No cache | `no-cache, no-store, must-revalidate` |
  | Static assets (CSS/JS) | Immutable | `max-age=31536000, immutable` |

- [ ] Configure Vercel headers in `vercel.json`:
  ```json
  {
    "headers": [
      {
        "source": "/assets/(.*)",
        "headers": [
          { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
        ]
      }
    ]
  }
  ```

- [ ] Implement **on-demand revalidation** endpoint:
  ```typescript
  // api/revalidate.ts
  // Called after post create/update/delete in admin
  // Purges Vercel cache for affected routes
  ```

- [ ] Add `ETag` support for API responses

### Files Created/Modified

| File | Action |
|---|---|
| `vercel.json` | **[MODIFY]** Add caching headers |
| `api/revalidate.ts` | **[NEW]** Cache purge endpoint |
| `src/lib/ssr.ts` | **[MODIFY]** Add cache headers to responses |

---

## 5.2 — Progressive Web App (PWA)

### Tasks

- [ ] Install PWA plugin:
  ```bash
  npm install -D vite-plugin-pwa
  ```
- [ ] Configure `vite.config.ts`:
  ```typescript
  import { VitePWA } from 'vite-plugin-pwa';

  export default defineConfig({
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'WPVite',
          short_name: 'WPVite',
          description: 'Lightweight Serverless CMS',
          theme_color: '#2563eb',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
              handler: 'CacheFirst',
              options: { cacheName: 'images', expiration: { maxEntries: 50 } },
            },
          ],
        },
      }),
    ],
  });
  ```

- [ ] Create dynamic manifest endpoint `api/manifest.json.ts`:
  - Reads `site_title` and `logo_url` from `options` table
  - Returns a valid `manifest.json` with dynamic values
  ```json
  {
    "name": "{site_title}",
    "short_name": "{site_title}",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#2563eb",
    "icons": [...]
  }
  ```

- [ ] Create offline fallback page:
  - Simple HTML page: "You are offline. Please check your connection."
  - Cached during service worker installation

- [ ] Generate PWA icons:
  - Create `public/icon-192.png` and `public/icon-512.png`
  - Create `public/apple-touch-icon.png`
  - Create `public/favicon.ico`

### Files Created/Modified

| File | Action |
|---|---|
| `vite.config.ts` | **[MODIFY]** Add VitePWA plugin |
| `api/manifest.json.ts` | **[NEW]** Dynamic manifest |
| `public/offline.html` | **[NEW]** Offline fallback |
| `public/icon-192.png` | **[NEW]** PWA icon |
| `public/icon-512.png` | **[NEW]** PWA icon |
| `public/favicon.ico` | **[NEW]** Favicon |

---

## 5.3 — Admin Dashboard Polish

### Tasks

- [ ] **Dashboard Page** (`src/admin/pages/Dashboard.tsx`):

  | Widget | Content |
  |---|---|
  | **Welcome Card** | "Welcome, {name}" + quick action buttons |
  | **Stats Overview** | Total Posts, Published, Drafts, Media count |
  | **Recent Posts** | Last 5 posts with status badges |
  | **Quick Draft** | Inline mini-editor for quick notes |

- [ ] **UI Polish items:**
  - [ ] Loading skeletons for all list pages
  - [ ] Toast notifications for CRUD operations (success/error)
  - [ ] Confirmation dialogs for delete operations
  - [ ] Empty states with helpful illustrations
  - [ ] Responsive sidebar (collapsible on mobile)
  - [ ] Keyboard shortcuts:

    | Shortcut | Action |
    |---|---|
    | `Ctrl+S` | Save post |
    | `Ctrl+Shift+P` | Publish post |
    | `Ctrl+K` | Open search |
    | `Esc` | Close modal/dialog |

- [ ] Install toast library:
  ```bash
  npm install react-hot-toast
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/pages/Dashboard.tsx` | **[MODIFY]** Full dashboard |
| `src/admin/components/Skeleton.tsx` | **[NEW]** Loading skeletons |
| `src/admin/components/EmptyState.tsx` | **[NEW]** Empty state UI |
| `src/admin/components/ConfirmDialog.tsx` | **[NEW]** Confirmation modal |

---

## 5.4 — Theme Documentation & Final THEME.md

### Tasks

- [ ] Review and finalize [`THEME.md`](file:///d:/WPVite/Plan/THEME.md):
  - Ensure all type interfaces match the actual implementation
  - Add troubleshooting section
  - Add "Creating Your First Theme" step-by-step tutorial
  - Document available Tailwind classes and utilities

- [ ] Create example theme scaffold CLI (optional):
  ```bash
  # Future: npx wpvite-create-theme my-theme
  ```

- [ ] Document the theme switching mechanism:
  - How `active_theme` option is read
  - How the SSR function dynamically imports theme components
  - How to test themes locally

---

## 5.5 — Final Testing & QA

### Tasks

- [ ] **Performance audit:**

  | Tool | Target Score |
  |---|---|
  | Lighthouse (Performance) | ≥ 90 |
  | Lighthouse (SEO) | ≥ 95 |
  | Lighthouse (Accessibility) | ≥ 90 |
  | Lighthouse (Best Practices) | ≥ 90 |
  | PageSpeed Insights (Mobile) | ≥ 85 |

- [ ] **Cross-browser testing:**
  - [ ] Chrome (latest)
  - [ ] Firefox (latest)
  - [ ] Safari (latest)
  - [ ] Mobile Safari (iOS)
  - [ ] Chrome Mobile (Android)

- [ ] **Functional testing matrix:**

  | Feature | Test Case |
  |---|---|
  | Auth | Login, logout, unauthorized access, first-run setup |
  | Posts | Create, edit, delete, publish, draft, search, paginate |
  | Media | Upload, delete, insert into editor, external URL |
  | Settings | Save/load all options, theme switching |
  | SSR | All routes render, correct data, SEO tags |
  | PWA | Install prompt, offline fallback, icon display |
  | Comments | Giscus loads, Disqus loads, disabled state |

- [ ] **Security checklist:**
  - [ ] All API endpoints require authentication (except public SSR)
  - [ ] JWT tokens have reasonable expiry
  - [ ] CSRF protection on state-changing endpoints
  - [ ] File upload validation (type, size)
  - [ ] SQL injection prevention (Drizzle ORM parameterized queries)
  - [ ] XSS protection (HTML sanitization for content)

---

## Verification Checklist

- [ ] Cache headers are correct per route (verify with `curl -I`)
- [ ] Updating a post triggers cache purge for that route
- [ ] PWA install prompt works on supported browsers
- [ ] Offline fallback page displays when network is unavailable
- [ ] Dynamic manifest returns correct site name and icons
- [ ] Dashboard loads with real statistics
- [ ] Toast notifications appear for all CRUD operations
- [ ] Responsive layout works on mobile (320px - 768px)
- [ ] Lighthouse scores meet target thresholds
- [ ] All functional test cases pass
- [ ] Security checklist items verified
