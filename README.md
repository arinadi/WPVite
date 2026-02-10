# WPVite

> Lightweight, serverless CMS with React/Vite architecture — mimics the WordPress writing experience with modern performance and developer flexibility.

**Created by:** ATechAsync

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
| Database | Neon (Serverless PostgreSQL) |
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
