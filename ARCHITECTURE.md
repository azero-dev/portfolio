# Architecture Decisions

This document outlines the architectural choices, component design, and data flow for the personal portfolio project.

## Overview

The portfolio is a hybrid static/dynamic site built with **Astro** as the primary framework. It leverages **Cloudflare Pages** for hosting, **D1** (SQLite) for ActivityPub data, and **KV** for caching. The site serves static HTML/CSS/JS where possible (blog, about page) and uses serverless functions (Cloudflare Functions) for ActivityPub endpoints.

## Core Principles

1. **Performance**: Pre‑render static pages, lazy‑load non‑critical JS, use Cloudflare's global CDN.
2. **Security**: CSP headers, rate limiting on `/inbox`, environment variables for secrets.
3. **Accessibility**: WCAG AA compliance, keyboard navigation, semantic HTML.
4. **Maintainability**: Clear separation of concerns, TypeScript strict mode, comprehensive testing.
5. **Extensibility**: Prepared for i18n, theme switching, additional content types.

## Technology Stack

| Layer                | Technology                        | Purpose                                                                |
| -------------------- | --------------------------------- | ---------------------------------------------------------------------- |
| Framework            | Astro 6.0                         | Static‑site generation, island architecture, React integration         |
| UI Library           | React 19                          | Interactive components (navigation, theme toggle, project tabs)        |
| Styling              | Tailwind CSS 3.4                  | Utility‑first CSS, custom theme (Minimal Cyberpunk)                    |
| Type Safety          | TypeScript 5.9                    | Static typing, enhanced developer experience                           |
| ActivityPub          | Fedify 2.0                        | Federation protocol handling, JSON‑LD serialization                    |
| Database             | Cloudflare D1 (SQLite)            | Store followers, posts, likes, shares, and Fedify metadata             |
| KV Store             | Cloudflare KV                     | Caching actor profiles, WebFinger responses, federation data           |
| Search               | Pagefind 1.4                      | Client‑side search over blog content (indexed at build time)           |
| Internationalization | astro‑i18n 2.2                    | Locale detection, route prefixing, dictionary management               |
| Testing              | Vitest 4.1, React Testing Library | Unit and integration tests, a11y audits with axe‑core                  |
| CI/CD                | GitHub Actions                    | Automated lint, typecheck, test, build, and deploy to Cloudflare Pages |
| Analytics            | Cloudflare Web Analytics          | Privacy‑friendly, cookieless traffic insights                          |
| Image Optimization   | Cloudflare Images binding         | On‑the‑fly resizing, WebP conversion, lazy loading                     |

## Component Architecture

### High‑Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare Pages (CDN)                   │
├─────────────────────────────────────────────────────────────┤
│  Static Assets (HTML, CSS, JS, fonts)                       │
│  └── Astro‑generated routes: /, /about, /blog, /blog/[slug] │
│                                                             │
│  Cloudflare Functions (serverless)                          │
│  ├── /.well‑known/webfinger  (ActivityPub discovery)       │
│  ├── /actor                   (Actor profile JSON‑LD)      │
│  ├── /inbox                   (Receive activities)         │
│  ├── /outbox                  (List published posts)       │
│  ├── /followers, /following   (Social graph)               │
│  └── /api/sync                (Sync blog posts to D1)      │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Cloudflare D1 (SQLite)                   │
│  └── followers, posts, likes, shares, kv_store tables      │
└─────────────────────────────────────────────────────────────┘
```

### Astro Layout & Pages

- **`src/layouts/Layout.astro`** – Root layout with `<html>`, `<head>`, `<body>`, includes navigation and footer.
- **`src/pages/index.astro`** – Homepage (blog listing) with pagination and tag filtering.
- **`src/pages/about.astro`** – About page with personal info, experience, projects, contact form.
- **`src/pages/blog/[...page].astro`** – Dynamic pagination route for blog.
- **`src/pages/blog/[slug].astro`** – Individual blog post page.
- **`src/pages/[...slug].astro`** – Catch‑all for i18n routes (e.g., `/es/about`).

### React Components (Islands)

Interactive components are built as React islands to keep JavaScript minimal:

- **`Navigation`** – Responsive top‑bar (desktop) / floating button (mobile) menu.
- **`ThemeToggle`** – Switches between dark/light themes (using `next‑themes`). Still not fully implemented.
- **`ProjectsTabs`** – Tabbed interface for filtering active/archived projects.
- **`BlogSidebar`** – Search bar and tag cloud for the blog.

### UI Primitive Components

Inspired by **shadcn/ui**, built with Tailwind and Radix primitives:

- `Button`, `Card`, `Tabs`, `Badge`, `Input`, `Textarea`
- Located in `src/components/ui/`
- Use `class‑variance‑authority` for variant management, `tailwind‑merge` for class combination.

### ActivityPub Functions

Each endpoint is a standalone Cloudflare Function (`.ts` file in `src/pages/`):

- **WebFinger** (`/.well‑known/webfinger`): Returns `acct:user@exampledomain.com` resource descriptor.
- **Actor** (`/actor`): JSON‑LD representation of the actor (Person) with public key.
- **Inbox** (`/inbox`): Accepts `POST` activities (Follow, Like, Announce, etc.) and logs them; `GET` returns empty ordered collection.
- **Outbox** (`/outbox`): `GET` returns a paginated list of `Create` activities (blog posts) from D1.
- **Sync** (`/api/sync`): Internal endpoint triggered after each build to insert/update blog posts in D1.

Fedify is used for JSON‑LD serialization/deserialization and cryptographic signing (when private key is provided).

## Data Flow

### Blog Post Publishing

1. Author writes a Markdown file in `src/content/blog/`.
2. On `git push`, GitHub Actions runs `pnpm build`.
3. The build step:
   - Astro generates static HTML for `/blog/[slug]`.
   - Pagefind indexes the content (`postbuild` hook).
4. After successful build, the deploy job calls the sync endpoint (`POST /api/sync`).
5. Sync endpoint reads all blog posts from the content collection and upserts them into the D1 `posts` table.
6. Each post receives an `ap_id` (ActivityPub ID) like `https://inferente.com/blog/{slug}`.
7. The post is now available in the actor's outbox and will be delivered to followers.

### ActivityPub Interaction

1. A Mastodon user searches for `@user@exampledomain.com`.
2. Mastodon performs WebFinger request to `/.well‑known/webfinger?resource=acct:user@exampledomain.com`.
3. WebFinger responds with the actor's URI (`https://exampledomain.com/actor`).
4. Mastodon fetches the actor profile (JSON‑LD) and displays follow button.
5. When user follows, Mastodon sends a `Follow` activity to `/inbox`.
6. The inbox logs the follower (could be stored in D1 `followers` table in future).
7. New blog posts appear in the outbox; Mastodon polls `/outbox` and delivers `Create` activities to followers' inboxes.

### Internationalization

- Middleware (`src/middleware.ts`) detects locale from URL prefix (`/es`, `/en‑GB`) or Accept‑Language header.
- Locale dictionaries live in `src/i18n/locales/` (currently `en‑GB.json`, `es.json`).
- Astro's `i18n` config in `astro.config.mjs` enables locale‑specific sitemap and routing.
- Components use the `t()` helper from `src/utils/i18n.ts`.

## Trade‑offs & Limitations

- **ActivityPub inbox handling**: Currently only logs incoming activities; full handling (accept/reject Follow, send updates) is left for future iteration.
- **Image optimization**: Relies on Cloudflare Images binding; fallback for local development is basic.
- **No real‑time search**: Pagefind index is rebuilt on each deploy; new posts appear in search only after redeploy.
- **KV caching simplicity**: Cache‑invalidation strategy is basic TTL; could be enhanced with stale‑while‑revalidate.

## Monitoring & Alerts

- **Uptime**: Cloudflare Health Checks on `/` and `/health` (if implemented).
- **Errors**: Cloudflare Pages logs, function‑invocation errors.
- **Traffic**: Cloudflare Analytics dashboard.
- **Database**: D1 query count and storage usage (Cloudflare dashboard).
