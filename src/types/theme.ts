// ============================================================
// WPVite — Shared Type Definitions for Theme System
// ============================================================
// These types define the data contracts between the SSR engine
// and theme templates. All themes must accept these prop types.
// ============================================================

// --- Data Types ---

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

// --- Pagination ---

export interface Pagination {
  currentPage: number;
  totalPages: number;
  nextUrl?: string;
  prevUrl?: string;
}

// --- Template Props ---

export interface HomeProps {
  settings: SiteSettings;
  posts: Post[];
  pagination?: Pagination;
}

export interface SingleProps {
  settings: SiteSettings;
  post: Post;
  relatedPosts?: Post[];
}

export interface PageProps {
  settings: SiteSettings;
  page: Post; // Pages share structure with Post
}

// --- Theme Manifest ---

export interface ThemeConfig {
  id: string;         // kebab-case unique identifier
  name: string;       // Display name
  version: string;
  author: string;
  description: string;
  templates: {
    Home: React.ComponentType<HomeProps>;
    Single: React.ComponentType<SingleProps>;
    Page: React.ComponentType<PageProps>;
    NotFound: React.ComponentType;
  };
}
