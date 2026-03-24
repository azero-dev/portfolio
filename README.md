# Personal Portfolio with Blog & ActivityPub

A modern, performant personal portfolio website built with Astro, React, and Tailwind CSS. Features a responsive blog with ActivityPub (Fediverse) integration, allowing followers to subscribe via Mastodon/Pleroma.

## Development State

This is a **work in progress** project! It is **not yet ready for deployment**.

## Features

- **Modern Stack**: Astro 6.0, React 19, TypeScript, Tailwind CSS 3
- **Responsive Design**
- **Blog System**: Markdown‑based posts with tags, pagination (15 posts/page), and client‑side search via Pagefind
- **ActivityPub Integration**: Fediverse‑compatible using Fedify, with Cloudflare Functions for `/inbox`, `/outbox`, WebFinger, etc.
- **Internationalization**: Ready for multiple locales (default: English British `en‑GB`), with middleware for auto‑detection
- **Performance Optimized**: SSG where possible, Cloudflare Images binding, CSP headers, cache policies
- **SEO & Accessibility**: Sitemap, RSS/Atom feeds, Open Graph, WCAG‑compliant contrast
- **Testing & CI**: Vitest, React Testing Library, axe‑core for a11y, GitHub Actions workflow (lint, typecheck, test, build, deploy)
- **Cloudflare Integration**: Pages hosting, D1 database (SQLite), KV storage, Analytics, Images

## Project Structure

```
portfolio/
├── src/
│   ├── components/          # Reusable Astro/React components
│   │   ├── about/           # About page components
│   │   ├── blog/            # Blog components (list, sidebar, search)
│   │   ├── layout/          # Layout components (Container, Section)
│   │   └── ui/              # UI primitives (shadcn/ui‑inspired)
│   ├── content/
│   │   └── blog/            # Blog posts in .md with frontmatter
│   ├── data/                # Static JSON data (projects, experience, skills)
│   ├── functions/           # Cloudflare Functions (ActivityPub endpoints)
│   ├── i18n/                # Internationalization config and locales
│   ├── layouts/             # Main layout (Layout.astro)
│   ├── pages/               # Astro routes (including API endpoints)
│   ├── styles/              # Global CSS, fonts, theme
│   ├── test/                # Test setup files
│   └── utils/               # Utility functions (i18n, pagination)
├── migrations/              # D1 database schema
├── public/                  # Static assets (fonts, images, headers)
└── (configuration files)    # astro.config.mjs, wrangler.toml, etc.
```

## Getting Started

### Prerequisites

- Node.js 22.12.0 or later
- pnpm 8.x or later (recommended) or npm/yarn
- Cloudflare account (for deployment, D1, KV)
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:

   ```bash
   pnpm install  # or npm install
   ```

3. Set up environment variables (optional for local dev):

   Copy `.env.example` to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and replace the placeholder tokens.

   For local ActivityPub testing, you'll also need to configure `wrangler.toml` with D1 and KV IDs (see [Deployment](#deployment)).

4. Run the development server:
   ```bash
   pnpm dev
   ```
   Open [http://localhost:4321](http://localhost:4321) to see your site.

### Available Scripts

- `pnpm dev` – Start development server
- `pnpm build` – Build for production (outputs to `dist/`)
- `pnpm preview` – Preview production build locally
- `pnpm lint` – Run ESLint
- `pnpm typecheck` – Run TypeScript compiler checks
- `pnpm test` – Run Vitest tests
- `pnpm format` – Format code with Prettier
- `pnpm lint:fix` – Auto‑fix linting issues
- `pnpm lighthouse` – Generate Lighthouse report (requires site deployed)
- `pnpm deploy` – Alias for `astro build` (used in CI/CD)

## Deployment

The project is configured for deployment on **Cloudflare Pages** with D1 and KV bindings.

### 1. Create Cloudflare resources

- **D1 database**: `npx wrangler d1 create portfolio-db`
- **KV namespace** (optional): `npx wrangler kv namespace create PORTFOLIO_KV`
- Update `wrangler.toml` with the generated IDs.

### 2. Apply migrations

```bash
npx wrangler d1 migrations apply portfolio-db --remote
```

### 3. Set environment variables in Cloudflare Pages dashboard

Required variables:

- `SYNC_TOKEN` – Secret token for blog‑post sync endpoint
- `FEDIFY_PRIVATE_KEY` – RSA private key (PEM) for ActivityPub signing
- `PUBLIC_CF_ANALYTICS_TOKEN` – Cloudflare Analytics token

Optional:

- `FEDIFY_PUBLIC_KEY` – Corresponding public key (can be derived)

### 4. Configure custom domain

In Cloudflare Pages > your project > Settings > Custom domains, add your domain.

### 5. Deploy via GitHub Actions

Push to the `main` branch; the CI workflow (`/.github/workflows/ci.yml`) will automatically run tests, build, and deploy.

## ActivityPub Setup

Refer to [ACTIVITYPUB_SETUP.md](./ACTIVITYPUB_SETUP.md) for detailed steps on generating keys, populating the database, and testing with the Fediverse.

## Content Management

### Blog Posts

Add `.md` files to `src/content/blog/` with frontmatter:

```yaml
---
title: 'My Post'
pubDate: 2025-03-23
description: 'A short description'
tags: ['astro', 'react']
draft: false
---
```

### Static Data

Edit JSON files in `src/data/`:

- `projects.json` – Portfolio projects (active/archived)
- `experience.json` – Work experience
- `education.json` – Education history
- `skills.json` – Skills by category

## Development Guidelines

See [CONTRIBUTING.md](./CONTRIBUTING.md) for coding standards, commit conventions, and pull‑request process.

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed decisions about the stack, data flow, and component design.

## Backups

### Database (D1)

You can export manually with:

```bash
npx wrangler d1 export portfolio-db --remote --output backup-$(date +%Y%m%d).sql
```

For convenience, a backup script is provided at `scripts/backup.sh`:

```bash
./scripts/backup.sh
```

Options:

- `--local` – backup local D1 database (for development)
- `--upload` – placeholder for future R2 upload (not implemented)

The script compresses the backup (gzip) and cleans up files older than 30 days.

Store the resulting SQL file in a secure location. Recommended frequency: weekly or before major changes.

### KV Storage

KV is used primarily for caching; backup is optional. To export, use the Cloudflare dashboard or the KV API.

## Monitoring

- **Cloudflare Analytics**: Already configured via `PUBLIC_CF_ANALYTICS_TOKEN`.
- **Health Checks**: Configure Cloudflare Health Checks to monitor uptime (dashboard > Websites > your domain > Health Checks).
- **Error Logs**: View in Cloudflare Dashboard > Workers & Pages > your project > Logs.

## License

MIT
