# WPVite

> Lightweight, serverless CMS with React/Vite architecture — mimics the WordPress writing experience with modern performance and developer flexibility.

**Created by:** ATechAsync

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Farinadi%2FWPVite&env=DATABASE_URL&envDescription=Will%20be%20auto-populated%20by%20Vercel%20Postgres&project-name=wpvite&repository-name=wpvite&stores=%5B%7B%22type%22%3A%22postgres%22%7D%2C%7B%22type%22%3A%22blob%22%7D%5D)

**What happens when you click Deploy:**
1. ✅ **Vercel Postgres** database is automatically created
2. ✅ **Vercel Blob** storage is automatically enabled  
3. ✅ `DATABASE_URL` environment variable is auto-populated
4. 🚀 Your WPVite instance is deployed and ready!

> **Note:** After deployment, run database migrations with `npm run db:generate && npm run db:migrate`

## Core Philosophy

> *"Admin is an App (SPA), Public is a Document (SSR/SEO)."*

## Architecture

| Realm | URL | Stack | Outcome |
|---|---|---|---|
| **Public** | `/*` | Vercel Serverless + React SSR | SEO-first, static HTML, cached |
| **Admin** | `/admin/*` | Vite SPA | Instant transitions, rich UI |

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (Vercel Serverless Functions) |
| Bundler | Vite + TypeScript |
| Database | Vercel Postgres (PostgreSQL) |
| ORM | Drizzle ORM |
| Frontend | React 18+ / Tailwind CSS |
| Editor | BlockNote (TipTap-based) |
| Auth | Google OAuth 2.0 (JWT / HttpOnly Cookie) |
| Storage | Vercel Blob |
| State | TanStack Query v5 |

## Features

- 🖊️ **WordPress-like Editor** — BlockNote with classic toolbar + slash commands
- 🎨 **Theme System** — Code-based themes in `src/themes/` (SSR rendered)
- 💬 **Comments** — External integration (Giscus / Disqus)
- 📱 **PWA** — Offline support, installable
- 🔐 **Auth** — Google OAuth, invite-only allowlist
- 🖼️ **Media Manager** — Vercel Blob upload + external URL hotlinking

## Development Phases

| Phase | Name | Status |
|---|---|---|
| 1 | [Foundation & Infrastructure](Plan/Phase-1-Plan.md) | 📋 Planned |
| 2 | [Authentication & Setup Wizard](Plan/Phase-2-Plan.md) | 📋 Planned |
| 3 | [The Content Engine (Admin)](Plan/Phase-3-Plan.md) | 📋 Planned |
| 4 | [The Public Renderer (SSR)](Plan/Phase-4-Plan.md) | 📋 Planned |
| 5 | [Optimization & PWA](Plan/Phase-5-Plan.md) | 📋 Planned |

## Documentation

- [Master Plan](Plan/MASTER-PLAN.md) — Full architecture, schema, and feature specs
- [Theme Guide](Plan/THEME.md) — How to create WPVite themes

## Project Structure

```
/
├── api/                  # Vercel Serverless Functions
│   ├── index.ts          # Public SSR Handler
│   ├── auth/             # OAuth Endpoints
│   └── trpc/             # REST API for Admin
├── src/
│   ├── admin/            # Admin SPA
│   │   ├── components/   # Editor, MediaManager
│   │   └── pages/        # Dashboard, PostList, Settings
│   ├── themes/           # Public Themes
│   │   └── default/      # Default Theme
│   ├── db/               # Drizzle Schema & Config
│   ├── lib/              # Utilities (Auth, API)
│   └── types/            # Shared TypeScript interfaces
├── drizzle/              # Migrations
├── public/               # Static Assets
├── Plan/                 # Planning Documents
├── vercel.json           # Vercel Config
└── vite.config.ts        # Vite Config
```
