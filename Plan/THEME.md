# WPVite Theme Development Guide

> This documentation serves as the **Primary Instruction** (System Prompt) for AI Agents or Developers tasked with creating new themes for WPVite.

> [!IMPORTANT]
> WPVite utilizes a unique architecture: **SPA-based Admin** (Vite) and **SSR-based Public Frontend** (Serverless Function). The themes you create will be rendered on the server into **static HTML**.

---

## 1. Core Principles (The Zen of WPVite Themes)

| Principle | Description |
|---|---|
| **Pure SSR** | Your theme components are rendered using `renderToString`. |
| **No Hydration (Mostly)** | By default, public pages are static HTML for speed and SEO. Do **not** rely on `useEffect` to load the main content. |
| **Tailwind First** | Use Tailwind CSS for styling. |
| **Data via Props** | All data (`Post`, `Settings`, `Menu`) is passed from the server as props. Do **not** fetch data inside the theme components. |

---

## 2. Theme Directory Structure

Every new theme must be created in its own folder within `src/themes/`.

**Example:** `src/themes/cyberpunk-lite/`

```
src/themes/[theme-name]/
├── assets/             # (Optional) Static images, default theme logo
├── components/         # UI Components (Header, Footer, Navbar, Card)
├── layouts/            # (Optional) Wrapper Layout if variations exist
├── templates/          # Main Pages (Mandatory)
│   ├── Home.tsx        # Homepage (Post List / Grid)
│   ├── Single.tsx      # Single Post View
│   ├── Page.tsx        # Static Page View
│   └── NotFound.tsx    # 404 Error Page
├── index.ts            # Entry Point (Theme Manifest)
└── styles.css          # (Optional) Custom CSS if Tailwind is insufficient
```

---

## 3. Data Contracts (TypeScript Interfaces)

Ensure your components are ready to receive props with the following data structure.

### A. Global Data Types

> Reference: `src/types/theme.ts`

```typescript
export interface Author {
  name: string;
  avatar?: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // HTML string processed from BlockNote
  featuredImage?: string;
  author: Author;
  publishedAt: string; // ISO String
  category?: string;
  tags?: string[];
}

export interface MenuLink {
  label: string;
  url: string;
  target?: '_blank' | '_self';
}

export interface SiteSettings {
  title: string;
  tagline: string;
  logoUrl?: string;
  menus: {
    primary: MenuLink[];
    footer: MenuLink[];
  };
  socials?: {
    twitter?: string;
    github?: string;
  };
}
```

### B. Props per Template

#### 1. `Home.tsx`

```typescript
interface HomeProps {
  settings: SiteSettings;
  posts: Post[]; // List of latest articles
  pagination?: {
    currentPage: number;
    totalPages: number;
    nextUrl?: string;
    prevUrl?: string;
  };
}
```

#### 2. `Single.tsx`

```typescript
interface SingleProps {
  settings: SiteSettings;
  post: Post; // The article currently being viewed
  relatedPosts?: Post[]; // (Optional) 3 related articles
}
```

#### 3. `Page.tsx`

```typescript
interface PageProps {
  settings: SiteSettings;
  page: Post; // Page structure is similar to Post but usually without author/date
}
```

---

## 4. Entry Point (`index.ts`)

Every theme **MUST** have an `index.ts` file that exports the configuration so the system can recognize it.

```typescript
// src/themes/theme-name/index.ts

import Home from './templates/Home';
import Single from './templates/Single';
import Page from './templates/Page';
import NotFound from './templates/NotFound';

export default {
  id: 'unique-theme-name', // Use kebab-case
  name: 'Cool Theme Name',
  version: '1.0.0',
  author: 'Your Name / AI',
  description: 'Short description of the theme...',
  templates: {
    Home,
    Single,
    Page,
    NotFound,
  },
};
```

---

## 5. Component Implementation Guide (Best Practices)

### Styling with Tailwind

Use utility classes directly.

```tsx
// ✅ Correct
<h1 className="text-3xl font-bold text-gray-900 mb-4 hover:text-blue-600 transition-colors">
  {post.title}
</h1>

// ❌ Incorrect (Avoid inline styles if possible)
<h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>...</h1>
```

### Handling HTML Content (Content Body)

Post content is stored as an HTML string. Use `dangerouslySetInnerHTML` and the `prose` class from `@tailwindcss/typography` to style it automatically.

```tsx
<article className="prose prose-lg max-w-none prose-slate dark:prose-invert">
  <div dangerouslySetInnerHTML={{ __html: post.content }} />
</article>
```

### Comment Integration (Giscus/Disqus)

The system will provide a `<Comments />` component, or you can provide an empty `div` slot that will be injected with the script by the main layout.

For themes, simply provide a container:

```tsx
<div id="comments-wrapper" className="mt-10 pt-10 border-t border-gray-200">
  {/* System will inject comment widget here */}
</div>
```

---

## 6. Simple Template Example (`Single.tsx`)

Use this example as a base reference (boilerplate) for creating the `templates/Single.tsx` file.

```tsx
import React from 'react';
import { SingleProps } from '../../types';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Single: React.FC<SingleProps> = ({ settings, post }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* 1. Global Header */}
      <Header settings={settings} />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">

        {/* 2. Featured Image */}
        {post.featuredImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg aspect-video relative">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* 3. Post Header */}
        <header className="mb-8 text-center">
          <div className="text-sm font-medium text-blue-600 mb-2 uppercase tracking-wide">
            {post.category || 'Uncategorized'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
            <span>By {post.author.name}</span>
            <span>•</span>
            <time>{new Date(post.publishedAt).toLocaleDateString()}</time>
          </div>
        </header>

        {/* 4. Post Content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* 5. Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 flex gap-2 flex-wrap justify-center">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-600 dark:text-gray-300">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 6. Comments Slot */}
        <div id="comments-wrapper" className="mt-12">
          {/* Widget render logic handled by core system */}
        </div>

      </main>

      {/* 7. Global Footer */}
      <Footer settings={settings} />
    </div>
  );
};

export default Single;
```
