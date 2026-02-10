# Phase 4: The Public Renderer (SSR)

> **Objective:** Build the server-side rendering pipeline — a Vercel serverless function that fetches data from Neon, renders the active theme to HTML, injects SEO meta tags, and integrates the comment widget.

---

## Prerequisites

| Item | Detail |
|---|---|
| **Phase 3** | Completed — Posts, Media, Settings, Editor all functional |
| **Active Theme** | At least the `default` theme created in `src/themes/default/` |
| **DB Seeded** | At least 1 published post and site settings configured |

---

## 4.1 — SSR Entry Point (Vercel Function)

### Tasks

- [ ] Rewrite `api/index.ts` as the main SSR handler:

  ```mermaid
  flowchart TD
      A["Incoming Request"] --> B{"Parse URL path"}
      B -->|"/"| C["Fetch latest posts → render Home"]
      B -->|"/p/:slug"| D["Fetch post by slug → render Single"]
      B -->|"/page/:slug"| E["Fetch page by slug → render Page"]
      B -->|"Not found"| F["Render NotFound"]
      C --> G["Load active theme from DB"]
      D --> G
      E --> G
      F --> G
      G --> H["renderToString(ThemeComponent, props)"]
      H --> I["Inject into HTML shell"]
      I --> J["Return Response with Cache headers"]
  ```

- [ ] Install SSR dependency:
  ```bash
  npm install react-dom/server
  ```
- [ ] Create `src/lib/ssr.ts` — SSR orchestrator:
  ```typescript
  export async function renderPage(req: Request): Promise<Response> {
    // 1. Parse URL
    // 2. Fetch data from DB
    // 3. Load active theme
    // 4. renderToString(Component, { settings, ...data })
    // 5. Inject into HTML shell with meta tags
    // 6. Return with cache headers
  }
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `api/index.ts` | **[MODIFY]** Full SSR handler |
| `src/lib/ssr.ts` | **[NEW]** SSR orchestrator |

---

## 4.2 — HTML Shell & `renderToString` Logic

### Tasks

- [ ] Create `src/lib/htmlShell.ts`:
  ```typescript
  export function buildHtml(options: {
    title: string;
    description: string;
    ogImage?: string;
    ogUrl: string;
    body: string;
    css: string;
  }): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${options.title}</title>
      <meta name="description" content="${options.description}">
      
      <!-- Open Graph -->
      <meta property="og:title" content="${options.title}">
      <meta property="og:description" content="${options.description}">
      <meta property="og:image" content="${options.ogImage || ''}">
      <meta property="og:url" content="${options.ogUrl}">
      <meta property="og:type" content="article">
      
      <!-- Twitter Card -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${options.title}">
      <meta name="twitter:description" content="${options.description}">
      
      <style>${options.css}</style>
    </head>
    <body>
      ${options.body}
    </body>
    </html>`;
  }
  ```
- [ ] Handle Tailwind CSS for SSR:
  - Option A: Pre-build Tailwind CSS at build time, include as static stylesheet
  - Option B: Use Tailwind's JIT to generate only used classes inline
  - **Recommended:** Option A — build Tailwind CSS once, reference via `<link>`

### Files Created/Modified

| File | Action |
|---|---|
| `src/lib/htmlShell.ts` | **[NEW]** HTML template builder |

---

## 4.3 — Route-to-Data Mapping

### Tasks

- [ ] Implement data fetching per route:

  | Route | DB Query | Theme Template | Props |
  |---|---|---|---|
  | `/` | Latest published posts (paginated) | `Home` | `{ settings, posts, pagination }` |
  | `/p/:slug` | Post by slug (status = published) | `Single` | `{ settings, post, relatedPosts }` |
  | `/page/:slug` | Page by slug | `Page` | `{ settings, page }` |
  | `*` | — | `NotFound` | `{ settings }` |

- [ ] Create `src/lib/dataFetchers.ts`:
  ```typescript
  export async function getHomeData(page: number) {
    // Query published posts, ordered by created_at DESC
    // Pagination: 10 posts per page
  }

  export async function getSingleData(slug: string) {
    // Query post by slug
    // Query 3 related posts (same category, exclude current)
  }

  export async function getPageData(slug: string) {
    // Query page by slug
  }

  export async function getSiteSettings() {
    // Query options table → build SiteSettings object
  }
  ```
- [ ] **Content transformation:** Convert BlockNote JSON → HTML string before passing to theme:
  ```typescript
  import { BlockNoteEditor } from '@blocknote/core';

  export function blocksToHtml(content: any): string {
    // Convert BlockNote JSON blocks to HTML
  }
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `src/lib/dataFetchers.ts` | **[NEW]** Data layer |
| `src/lib/contentTransform.ts` | **[NEW]** BlockNote JSON → HTML |

---

## 4.4 — Default Theme

### Tasks

- [ ] Create the `default` theme following [`THEME.md`](file:///d:/WPVite/Plan/THEME.md) guidelines:

  ```
  src/themes/default/
  ├── components/
  │   ├── Header.tsx       # Logo + Primary Menu
  │   ├── Footer.tsx       # Copyright + Footer Menu + Socials
  │   ├── PostCard.tsx     # Card for post list
  │   └── Pagination.tsx   # Page navigation
  ├── templates/
  │   ├── Home.tsx         # Post grid/list layout
  │   ├── Single.tsx       # Full article view
  │   ├── Page.tsx         # Static page view
  │   └── NotFound.tsx     # 404 page
  ├── index.ts             # Theme manifest
  └── styles.css           # (Optional) Custom overrides
  ```

- [ ] Design guidelines for default theme:

  | Aspect | Specification |
  |---|---|
  | **Style** | Clean, minimal, modern blog |
  | **Colors** | Neutral (grays) + accent (blue-600) |
  | **Typography** | `prose` class from Tailwind Typography |
  | **Layout** | Centered container, `max-w-4xl` for content |
  | **Dark Mode** | Supported via `dark:` Tailwind classes |
  | **Responsive** | Mobile-first, responsive breakpoints |

- [ ] Implement `Home.tsx`:
  - Hero section with site title and tagline
  - Post grid (2 columns on desktop, 1 on mobile)
  - Each card: Featured image, title, excerpt, date, author
  - Pagination at bottom

- [ ] Implement `Single.tsx`:
  - Full-width featured image
  - Title, author, date, category
  - Content body with `prose` styling
  - Tags list
  - Comments container slot
  - Related posts section

- [ ] Implement `Page.tsx`:
  - Simple layout: title + content body

- [ ] Implement `NotFound.tsx`:
  - Friendly 404 message with link back to home

### Files Created/Modified

| File | Action |
|---|---|
| `src/themes/default/components/Header.tsx` | **[NEW]** |
| `src/themes/default/components/Footer.tsx` | **[NEW]** |
| `src/themes/default/components/PostCard.tsx` | **[NEW]** |
| `src/themes/default/components/Pagination.tsx` | **[NEW]** |
| `src/themes/default/templates/Home.tsx` | **[NEW]** |
| `src/themes/default/templates/Single.tsx` | **[NEW]** |
| `src/themes/default/templates/Page.tsx` | **[NEW]** |
| `src/themes/default/templates/NotFound.tsx` | **[NEW]** |
| `src/themes/default/index.ts` | **[NEW]** |

---

## 4.5 — SEO Meta Tag Injection

### Tasks

- [ ] Dynamic meta tags per route:

  | Route | `<title>` | `og:description` | `og:image` |
  |---|---|---|---|
  | `/` | `{siteTitle} — {tagline}` | Tagline | Logo |
  | `/p/:slug` | `{postTitle} — {siteTitle}` | Excerpt | Featured Image |
  | `/page/:slug` | `{pageTitle} — {siteTitle}` | Excerpt | — |
  | `404` | `Page Not Found — {siteTitle}` | — | — |

- [ ] Structured data (JSON-LD) for posts:
  ```html
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Post Title",
    "author": { "@type": "Person", "name": "Author" },
    "datePublished": "2026-01-01",
    "image": "https://..."
  }
  </script>
  ```
- [ ] Add `<link rel="canonical">` for all pages
- [ ] Sitemap generation endpoint: `api/sitemap.xml.ts`

### Files Created/Modified

| File | Action |
|---|---|
| `src/lib/seo.ts` | **[NEW]** Meta tag builder |
| `api/sitemap.xml.ts` | **[NEW]** Dynamic sitemap |

---

## 4.6 — Comment Widget Integration

### Tasks

- [ ] Create `src/lib/commentRenderer.ts`:
  ```typescript
  export function renderCommentWidget(config: CommentConfig, postSlug: string): string {
    if (config.provider === 'none') return '';

    if (config.provider === 'giscus') {
      return `<script src="https://giscus.app/client.js"
        data-repo="${config.giscus_repo}"
        data-repo-id="..."
        data-category="..."
        data-mapping="pathname"
        data-theme="preferred_color_scheme"
        crossorigin="anonymous"
        async>
      </script>`;
    }

    if (config.provider === 'disqus') {
      return `<div id="disqus_thread"></div>
      <script>
        var disqus_config = function () {
          this.page.url = '${postSlug}';
          this.page.identifier = '${postSlug}';
        };
        (function() {
          var d = document, s = d.createElement('script');
          s.src = 'https://${config.disqus_shortname}.disqus.com/embed.js';
          s.setAttribute('data-timestamp', +new Date());
          (d.head || d.body).appendChild(s);
        })();
      </script>`;
    }
  }
  ```
- [ ] Inject comment widget into `#comments-wrapper` in the HTML shell (only for `Single` template)
- [ ] Respect per-post `allow_comments` flag

### Files Created/Modified

| File | Action |
|---|---|
| `src/lib/commentRenderer.ts` | **[NEW]** Comment widget builder |

---

## Verification Checklist

- [ ] Visiting `/` renders the Home template with a list of posts
- [ ] Visiting `/p/:slug` renders the full article with correct data
- [ ] Visiting `/page/:slug` renders the page content
- [ ] Visiting any unknown URL renders the 404 page
- [ ] View Page Source shows fully rendered HTML (no JS-dependent content)
- [ ] Open Graph tags render correctly (test with [opengraph.xyz](https://opengraph.xyz))
- [ ] `<link rel="canonical">` is correct on every page
- [ ] JSON-LD structured data is valid (test with Google Rich Results Test)
- [ ] `/api/sitemap.xml` returns valid XML sitemap
- [ ] Comment widget (Giscus or Disqus) loads on Single post page
- [ ] Comments are hidden when `allow_comments` is `false`
- [ ] Dark mode classes render correctly in SSR output
