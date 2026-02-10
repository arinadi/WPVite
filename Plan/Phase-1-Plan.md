# Phase 1: Foundation & Infrastructure

> **Objective:** Bootstrap the entire project from scratch — Vite, TypeScript, Vercel hosting, Neon database, and Drizzle ORM — and validate end-to-end connectivity.

---

## Prerequisites

| Item | Detail |
|---|---|
| **Vercel Account** | Connected to the GitHub repository |
| **Neon Database** | A new Serverless PostgreSQL project created on [neon.tech](https://neon.tech) |
| **Environment Variables** | `DATABASE_URL` from Neon dashboard |
| **Node.js** | v18+ installed locally |

---

## 1.1 — Initialize Vite + TypeScript Project

### Tasks

- [ ] Run `npm create vite@latest ./ -- --template react-ts`
- [ ] Install core dependencies:
  ```bash
  npm install react react-dom
  npm install -D typescript @types/react @types/react-dom
  ```
- [ ] Verify project builds with `npm run build`
- [ ] Configure `tsconfig.json`:
  - Set `"strict": true`
  - Add path aliases (`@/` → `src/`)

### Files Created/Modified

| File | Action |
|---|---|
| `vite.config.ts` | Configure path aliases, plugins |
| `tsconfig.json` | Strict mode, path aliases |
| `package.json` | Dependencies |

---

## 1.2 — Setup Vercel Project

### Tasks

- [ ] Link local project to Vercel via `vercel link`
- [ ] Configure `vercel.json` with initial rewrites:
  ```json
  {
    "rewrites": [
      { "source": "/admin/(.*)", "destination": "/index.html" },
      { "source": "/(.*)", "destination": "/api/index.ts" }
    ]
  }
  ```
- [ ] Set environment variables on Vercel Dashboard:
  - `DATABASE_URL` (from Neon)
  - `NODE_ENV` = `production`
- [ ] Test initial deployment with `vercel deploy`

### Files Created/Modified

| File | Action |
|---|---|
| `vercel.json` | **[NEW]** Rewrites & headers configuration |
| `.vercelignore` | **[NEW]** Ignore patterns |

---

## 1.3 — Setup Neon Database

### Tasks

- [ ] Create a new Neon project named `wpvite`
- [ ] Copy the `DATABASE_URL` connection string
- [ ] Add to `.env.local`:
  ```env
  DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/wpvite?sslmode=require
  ```
- [ ] Verify connectivity with a simple SQL query via Neon console

---

## 1.4 — Configure Drizzle ORM & Initial Schema

### Tasks

- [ ] Install Drizzle:
  ```bash
  npm install drizzle-orm @neondatabase/serverless
  npm install -D drizzle-kit dotenv
  ```
- [ ] Create `drizzle.config.ts`:
  ```typescript
  import { defineConfig } from 'drizzle-kit';

  export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
      url: process.env.DATABASE_URL!,
    },
  });
  ```
- [ ] Create initial schema file `src/db/schema.ts` with all 4 tables:
  - `users` — id, email, google_id, role, name, avatar_url
  - `posts` — id, slug, title, content, excerpt, status, featured_image, allow_comments, author_id, created_at, updated_at
  - `media` — id, url, type, alt_text, uploaded_at
  - `options` — key (PK), value
- [ ] Create DB client `src/db/index.ts`:
  ```typescript
  import { neon } from '@neondatabase/serverless';
  import { drizzle } from 'drizzle-orm/neon-http';
  import * as schema from './schema';

  const sql = neon(process.env.DATABASE_URL!);
  export const db = drizzle(sql, { schema });
  ```
- [ ] Run migration:
  ```bash
  npx drizzle-kit generate
  npx drizzle-kit migrate
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `drizzle.config.ts` | **[NEW]** Drizzle Kit configuration |
| `src/db/schema.ts` | **[NEW]** All table definitions |
| `src/db/index.ts` | **[NEW]** DB client singleton |
| `drizzle/` | **[NEW]** Generated migration files |

---

## 1.5 — Create Basic Serverless Function (DB Connectivity Test)

### Tasks

- [ ] Create `api/index.ts`:
  ```typescript
  import { db } from '../src/db';
  import { options } from '../src/db/schema';

  export default async function handler(req, res) {
    try {
      // Test: Insert a seed option
      await db.insert(options).values({
        key: 'site_title',
        value: 'My WPVite Site',
      }).onConflictDoNothing();

      // Test: Read it back
      const result = await db.select().from(options);
      res.json({ status: 'ok', data: result });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
  ```
- [ ] Deploy to Vercel and verify the JSON response
- [ ] Clean up the test seed after verification

### Files Created/Modified

| File | Action |
|---|---|
| `api/index.ts` | **[NEW]** SSR handler (initially a test endpoint) |

---

## 1.6 — Setup Initial Directory Structure

### Tasks

- [ ] Create the skeleton folder structure:
  ```
  src/
  ├── admin/
  │   ├── components/
  │   └── pages/
  ├── themes/
  │   └── default/
  │       ├── components/
  │       ├── templates/
  │       └── index.ts
  ├── db/
  ├── lib/
  └── types/
      └── theme.ts
  ```
- [ ] Create shared type definitions in `src/types/theme.ts` (as documented in [`THEME.md`](file:///d:/WPVite/Plan/THEME.md))

---

## Verification Checklist

- [ ] `npm run dev` starts local dev server without errors
- [ ] `npm run build` completes successfully
- [ ] `vercel deploy` deploys without errors
- [ ] Visiting the deployed API endpoint returns `{ "status": "ok", "data": [...] }`
- [ ] Drizzle Studio (`npx drizzle-kit studio`) shows all 4 tables
- [ ] All environment variables are correctly set on Vercel
