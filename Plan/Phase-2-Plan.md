# Phase 2: Authentication & Setup Wizard

> **Objective:** Implement the full authentication flow using Google OAuth 2.0, create the first-run setup wizard, and build the Admin Layout Shell.

---

## Prerequisites

| Item | Detail |
|---|---|
| **Phase 1** | Completed — DB connected, Drizzle schema ready |
| **Google Cloud Console** | OAuth 2.0 Client ID & Secret created |
| **Environment Variables** | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `JWT_SECRET` |

---

## 2.1 — Google OAuth 2.0 Flow

### Tasks

- [ ] Create OAuth API endpoints:

  | Endpoint | Method | Purpose |
  |---|---|---|
  | `api/auth/google.ts` | `GET` | Redirect user to Google consent screen |
  | `api/auth/callback.ts` | `GET` | Handle Google callback, create session |
  | `api/auth/me.ts` | `GET` | Return current user from JWT cookie |
  | `api/auth/logout.ts` | `POST` | Clear session cookie |

- [ ] Install dependencies:
  ```bash
  npm install jose
  ```
- [ ] Implement the OAuth flow:

  ```mermaid
  sequenceDiagram
      participant U as User
      participant A as Admin SPA
      participant S as /api/auth/google
      participant G as Google OAuth
      participant C as /api/auth/callback
      participant DB as Neon DB

      U->>A: Click "Login with Google"
      A->>S: Redirect
      S->>G: Consent Screen
      G->>C: Authorization Code
      C->>G: Exchange for Access Token
      G->>C: User Profile (email, name, avatar)
      C->>DB: Check if email exists in users table
      alt Email found
          C->>C: Generate JWT
          C->>U: Set HttpOnly Cookie + Redirect to /admin
      else Email not found & users table empty
          C->>DB: Insert as Super Admin
          C->>C: Generate JWT
          C->>U: Set HttpOnly Cookie + Redirect to /admin/setup
      else Email not found & users exist
          C->>U: 403 Forbidden
      end
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `api/auth/google.ts` | **[NEW]** OAuth initiation |
| `api/auth/callback.ts` | **[NEW]** OAuth callback handler |
| `api/auth/me.ts` | **[NEW]** Current user endpoint |
| `api/auth/logout.ts` | **[NEW]** Session termination |
| `src/lib/auth.ts` | **[NEW]** JWT sign/verify utilities |

---

## 2.2 — JWT & Cookie Handling

### Tasks

- [ ] Create `src/lib/auth.ts` with utilities:
  ```typescript
  // Key functions
  generateToken(user: User): Promise<string>
  verifyToken(token: string): Promise<UserPayload | null>
  setAuthCookie(res: Response, token: string): void
  clearAuthCookie(res: Response): void
  ```
- [ ] Cookie configuration:

  | Property | Value |
  |---|---|
  | `httpOnly` | `true` |
  | `secure` | `true` (production) |
  | `sameSite` | `lax` |
  | `path` | `/` |
  | `maxAge` | 7 days (`604800`) |

- [ ] Create auth middleware `src/lib/withAuth.ts`:
  - Extract JWT from cookie
  - Verify and decode
  - Attach `user` to request context
  - Return 401 if invalid/missing

---

## 2.3 — First-Run Setup Wizard (`/setup`)

### Tasks

- [ ] Create `src/admin/pages/Setup.tsx`:
  - Detect if `users` table is empty (via `api/auth/me` or dedicated endpoint)
  - If empty → show setup wizard UI
  - If not empty → redirect to `/admin`
- [ ] Setup wizard steps:

  | Step | Fields | Notes |
  |---|---|---|
  | **1. Welcome** | — | Informational screen |
  | **2. Site Identity** | Site Title, Tagline | Saved to `options` table |
  | **3. Confirm** | — | Show summary, "Launch" button |

- [ ] Create `api/setup.ts` endpoint:
  - Only works when `users` table is empty (safety check)
  - Saves initial site settings to `options` table
  - Returns success

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/pages/Setup.tsx` | **[NEW]** Setup wizard UI |
| `api/setup.ts` | **[NEW]** Setup data endpoint |

---

## 2.4 — Admin Layout Shell

### Tasks

- [ ] Create the Admin Layout with the following components:

  ```
  src/admin/
  ├── components/
  │   ├── AdminLayout.tsx    # Wrapper with Sidebar + Header
  │   ├── Sidebar.tsx        # Navigation menu
  │   ├── Header.tsx         # Top bar with user avatar + logout
  │   └── ProtectedRoute.tsx # Auth guard wrapper
  └── pages/
      ├── Dashboard.tsx      # Placeholder overview page
      ├── Setup.tsx          # First-run wizard
      └── Login.tsx          # Login page with Google button
  ```

- [ ] Sidebar navigation items:

  | Icon | Label | Route |
  |---|---|---|
  | 📊 | Dashboard | `/admin` |
  | 📝 | Posts | `/admin/posts` |
  | 📄 | Pages | `/admin/pages` |
  | 🖼️ | Media | `/admin/media` |
  | ⚙️ | Settings | `/admin/settings` |

- [ ] Install and configure React Router:
  ```bash
  npm install react-router-dom
  ```
- [ ] Configure routing in `src/admin/App.tsx`:
  ```typescript
  <Routes>
    <Route path="/admin/login" element={<Login />} />
    <Route path="/admin/setup" element={<Setup />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/posts" element={<PostList />} />
        {/* ... more routes */}
      </Route>
    </Route>
  </Routes>
  ```

### Files Created/Modified

| File | Action |
|---|---|
| `src/admin/App.tsx` | **[NEW]** Main admin routing |
| `src/admin/components/AdminLayout.tsx` | **[NEW]** Layout shell |
| `src/admin/components/Sidebar.tsx` | **[NEW]** Nav sidebar |
| `src/admin/components/Header.tsx` | **[NEW]** Top bar |
| `src/admin/components/ProtectedRoute.tsx` | **[NEW]** Auth guard |
| `src/admin/pages/Login.tsx` | **[NEW]** Login page |
| `src/admin/pages/Dashboard.tsx` | **[NEW]** Placeholder dashboard |

---

## 2.5 — Install Tailwind CSS

### Tasks

- [ ] Install Tailwind:
  ```bash
  npm install -D tailwindcss @tailwindcss/typography postcss autoprefixer
  npx tailwindcss init -p
  ```
- [ ] Configure `tailwind.config.js`:
  - Content paths: `['./src/**/*.{ts,tsx}', './index.html']`
  - Add `@tailwindcss/typography` plugin
- [ ] Create `src/index.css` with Tailwind directives:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  ```

---

## Verification Checklist

- [ ] Clicking "Login with Google" redirects to Google consent screen
- [ ] After consent, user is redirected back with a valid JWT cookie
- [ ] `api/auth/me` returns the logged-in user's data
- [ ] First-time login creates a Super Admin in the `users` table
- [ ] Unauthorized emails receive a 403 response
- [ ] `/admin` is only accessible when authenticated (redirects to `/admin/login` otherwise)
- [ ] Setup wizard appears on first run and saves settings to DB
- [ ] Admin sidebar navigation works between all routes
- [ ] Logout clears the cookie and redirects to login
