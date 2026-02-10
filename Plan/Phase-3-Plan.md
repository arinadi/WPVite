# Phase 3: The Content Engine (Admin)

> **Objective:** Build the full content management experience — Media Manager with Vercel Blob uploads, BlockNote editor integration, complete Post CRUD, and a Settings page.

---

## Prerequisites

| Item | Detail |
|---|---|
| **Phase 2** | Completed — Auth, Admin Shell, Tailwind configured |
| **Vercel Blob** | Token generated from Vercel Dashboard |
| **Environment Variables** | `BLOB_READ_WRITE_TOKEN` |
| **Additional Deps** | TanStack Query, BlockNote |

---

## 3.1 — API Layer (CRUD Endpoints)

### Tasks

- [ ] Install TanStack Query:
  ```bash
  npm install @tanstack/react-query
  ```
- [ ] Create REST API endpoints:

  | Endpoint | Method | Description |
  |---|---|---|
  | `api/posts/index.ts` | `GET` | List posts (paginated, filterable by status) |
  | `api/posts/index.ts` | `POST` | Create new post |
  | `api/posts/[id].ts` | `GET` | Get single post |
  | `api/posts/[id].ts` | `PUT` | Update post |
  | `api/posts/[id].ts` | `DELETE` | Delete post |
  | `api/media/index.ts` | `GET` | List media (paginated) |
  | `api/media/upload.ts` | `POST` | Upload to Vercel Blob |
  | `api/media/[id].ts` | `DELETE` | Delete media |
  | `api/options/index.ts` | `GET` | Get all options |
  | `api/options/index.ts` | `PUT` | Update options |

- [ ] All endpoints protected with `withAuth` middleware (from Phase 2)
- [ ] Create API client helper `src/lib/api.ts`:
  ```typescript
  const api = {
    get: (url: string) => fetch(url, { credentials: 'include' }).then(r => r.json()),
    post: (url: string, data: any) => fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json()),
    // ... put, delete
  };
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `api/posts/index.ts` | **[NEW]** List & create posts |
| `api/posts/[id].ts` | **[NEW]** Get, update, delete post |
| `api/media/index.ts` | **[NEW]** List media |
| `api/media/upload.ts` | **[NEW]** Upload handler |
| `api/media/[id].ts` | **[NEW]** Delete media |
| `api/options/index.ts` | **[NEW]** Get & update options |
| `src/lib/api.ts` | **[NEW]** API client |

---

## 3.2 — Media Manager

### Tasks

- [ ] Install Vercel Blob SDK:
  ```bash
  npm install @vercel/blob
  ```
- [ ] Create `src/admin/components/MediaManager.tsx`:

  ```mermaid
  graph TD
      A["Media Manager Modal"] --> B["Tab: Library"]
      A --> C["Tab: Upload"]
      B --> D["Grid of uploaded images"]
      D --> E["Click to select / insert"]
      C --> F["Drag & Drop zone"]
      C --> G["External URL input"]
      F --> H["Upload to Vercel Blob"]
      G --> I["Save URL to media table"]
      H --> I
  ```

- [ ] **Library Tab:**
  - Grid view with thumbnails from `media` table
  - Search/filter by filename
  - Click to select → returns `{ url, alt_text }` to caller
  - Delete button with confirmation
- [ ] **Upload Tab:**
  - Drag & Drop zone using native HTML5 API
  - File type validation (images only: `image/*`)
  - Max file size: 10MB
  - Upload progress indicator
  - External URL input with preview
- [ ] Upload flow:
  ```typescript
  // api/media/upload.ts
  import { put } from '@vercel/blob';

  // 1. Receive file from FormData
  // 2. Upload to Vercel Blob
  // 3. Save record to media table
  // 4. Return { id, url, type }
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/components/MediaManager.tsx` | **[NEW]** Modal UI |
| `src/admin/components/MediaGrid.tsx` | **[NEW]** Thumbnail grid |
| `src/admin/components/UploadZone.tsx` | **[NEW]** Drag & drop |
| `src/admin/pages/Media.tsx` | **[NEW]** Media library page |

---

## 3.3 — BlockNote Editor Integration

### Tasks

- [ ] Install BlockNote:
  ```bash
  npm install @blocknote/core @blocknote/react @blocknote/mantine
  ```
- [ ] Create `src/admin/components/Editor.tsx`:
  - Initialize BlockNote with custom toolbar configuration
  - **Fixed Top Toolbar** (WordPress Classic style):
    - Bold, Italic, Underline, Strikethrough
    - Heading levels (H1, H2, H3)
    - Bullet List, Numbered List
    - Link, Image (opens Media Manager)
    - Code Block, Quote
  - **Slash Commands** (`/`):
    - `/image` — Insert image via Media Manager
    - `/heading` — Insert heading
    - `/list` — Insert list
    - `/quote` — Insert blockquote
    - `/code` — Insert code block
    - `/divider` — Insert horizontal rule
- [ ] Media Manager integration:
  - Clicking the Image button (toolbar or slash command) opens `MediaManager` modal
  - On selection, insert the image block into the editor
- [ ] Content serialization:
  - Save: Convert BlockNote JSON → store in `posts.content`
  - Load: Parse JSON → restore editor state
  - Render (for SSR): Convert BlockNote JSON → HTML string

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/components/Editor.tsx` | **[NEW]** BlockNote wrapper |
| `src/admin/components/EditorToolbar.tsx` | **[NEW]** Custom toolbar |

---

## 3.4 — Post Management

### Tasks

- [ ] Create **Post List** page (`src/admin/pages/PostList.tsx`):

  | Column | Content |
  |---|---|
  | **Title** | Post title (clickable → edit) |
  | **Status** | Badge: Published / Draft / Private |
  | **Author** | Author name + avatar |
  | **Date** | Created/Updated date |
  | **Actions** | Edit, Delete, View |

  - Filter by status (All, Published, Draft, Private)
  - Pagination
  - Search by title

- [ ] Create **Post Editor** page (`src/admin/pages/PostEditor.tsx`):

  | Section | Details |
  |---|---|
  | **Main Area** | BlockNote Editor (content) |
  | **Sidebar Panel** | Title input, Slug (auto-generated from title), Status selector, Featured Image (opens Media Manager), Excerpt textarea, Category input, Tags input, Allow Comments toggle |
  | **Actions** | Save Draft, Publish, Preview |

  - Auto-save every 30 seconds (debounced)
  - Slug auto-generation from title (using `slugify`)
  - Unsaved changes warning on navigation

- [ ] Install slug utility:
  ```bash
  npm install slugify
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/pages/PostList.tsx` | **[NEW]** Post list with filters |
| `src/admin/pages/PostEditor.tsx` | **[NEW]** Post creation/editing |
| `src/admin/hooks/usePosts.ts` | **[NEW]** TanStack Query hooks |
| `src/admin/hooks/useMedia.ts` | **[NEW]** TanStack Query hooks |

---

## 3.5 — Settings Page

### Tasks

- [ ] Create **Settings Page** (`src/admin/pages/Settings.tsx`) with tabs:

  | Tab | Fields |
  |---|---|
  | **Site Identity** | Site Title, Tagline, Logo (Media Manager) |
  | **Discussion** | Enable Comments (global toggle), Comment Provider (`giscus` / `disqus` / `none`), Disqus Shortname, Giscus Repo + Config |
  | **Theme** | Active Theme selector (reads from `src/themes/` folder listing), Theme preview thumbnail |
  | **Users** | List of authorized emails, Add/Remove users, Role assignment |

- [ ] Create `api/users/index.ts`:
  - `GET` — List all users (admin only)
  - `POST` — Add new user email to allowlist
  - `DELETE` — Remove user

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/pages/Settings.tsx` | **[NEW]** Settings tabs |
| `src/admin/components/SettingsTabs/SiteIdentity.tsx` | **[NEW]** |
| `src/admin/components/SettingsTabs/Discussion.tsx` | **[NEW]** |
| `src/admin/components/SettingsTabs/ThemeSelector.tsx` | **[NEW]** |
| `src/admin/components/SettingsTabs/UserManager.tsx` | **[NEW]** |
| `api/users/index.ts` | **[NEW]** User management |

---

## Verification Checklist

- [ ] Upload an image via drag & drop → appears in Media Library
- [ ] Insert an external URL → preview shows correctly
- [ ] BlockNote editor loads and saves content to the DB
- [ ] Slash commands (`/image`, `/heading`, etc.) work correctly
- [ ] Create a post → appears in Post List with correct status
- [ ] Edit an existing post → changes persist after save
- [ ] Delete a post → removed from list & DB
- [ ] Auto-save triggers after 30 seconds of inactivity
- [ ] Settings save correctly to `options` table
- [ ] User management (add/remove) works for Super Admin
- [ ] Featured image selection via Media Manager works from Post Editor
