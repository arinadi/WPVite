import {
  pgTable,
  uuid,
  varchar,
  pgEnum,
  text,
  jsonb,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

// --- Enums ---

export const userRoleEnum = pgEnum('user_role', [
  'super_admin',
  'editor',
  'author',
]);

export const postStatusEnum = pgEnum('post_status', [
  'published',
  'draft',
  'private',
]);

// --- Tables ---

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  googleId: varchar('google_id', { length: 255 }),
  role: userRoleEnum('role').notNull().default('author'),
  name: varchar('name', { length: 255 }),
  avatarUrl: varchar('avatar_url', { length: 512 }),
});

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  content: jsonb('content'), // BlockNote structured content
  excerpt: text('excerpt'),
  status: postStatusEnum('status').notNull().default('draft'),
  featuredImage: varchar('featured_image', { length: 512 }),
  allowComments: boolean('allow_comments').notNull().default(true),
  authorId: uuid('author_id').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  url: varchar('url', { length: 512 }).notNull(),
  type: varchar('type', { length: 100 }), // MIME type
  altText: varchar('alt_text', { length: 255 }),
  uploadedAt: timestamp('uploaded_at', { withTimezone: true }).notNull().defaultNow(),
});

export const options = pgTable('options', {
  key: varchar('key', { length: 255 }).primaryKey(),
  value: text('value'),
});
