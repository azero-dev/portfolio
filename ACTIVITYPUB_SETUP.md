# ActivityPub Setup Guide

This document outlines the steps to complete the ActivityPub integration (Phase 7) for your portfolio.

Remember: This is a project still under development!

## What's Been Implemented

1. **Dependencies**: `@fedify/fedify` installed.
2. **Cloudflare adapter**: Configured in `astro.config.mjs` with `output: 'server'`.
3. **Database schema**: Migration file at `migrations/0001_initial.sql` for D1 tables.
4. **ActivityPub endpoints** (serverless functions):
   - `/.well-known/webfinger` – WebFinger discovery.
   - `/actor` – Actor profile (JSON‑LD).
   - `/inbox` – Accepts incoming activities (POST) and returns empty collection (GET).
   - `/outbox` – Returns `Create` activities for blog posts (reads from D1).
   - `/followers` – Empty followers collection.
   - `/following` – Empty following collection.
5. **Sync endpoint**: `POST /api/sync` – synchronizes blog posts into D1 (requires `Authorization: Bearer <SYNC_TOKEN>`).
6. **Configuration files**:
   - `wrangler.toml` – Bindings for D1 and KV (placeholders).
   - `pagefind.json` – Already present.

## Steps to Complete

### 1. Create Cloudflare D1 Database

```bash
npx wrangler d1 create portfolio-db
```

Update `wrangler.toml` with the generated `database_id` and `preview_database_id`.

### 2. Create Cloudflare KV Namespace (optional, for caching)

```bash
npx wrangler kv namespace create PORTFOLIO_KV
```

Update `wrangler.toml` with the KV `id` and `preview_id`.

### 3. Apply Migrations Locally

```bash
npx wrangler d1 migrations apply portfolio-db --local
```

For production:

```bash
npx wrangler d1 migrations apply portfolio-db --remote
```

### 4. Generate Actor Key Pair

Fedify needs a cryptographic key pair for signing activities. Generate one with:

```bash
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```

Store the private key in Cloudflare Pages Environment Variables as `FEDIFY_PRIVATE_KEY` (PEM format). The public key will be embedded in the actor profile (currently placeholder).

Update `/actor` endpoint to serve the real public key.

### 5. Configure Environment Variables in Cloudflare Pages

- `SYNC_TOKEN`: A secret token for the sync endpoint.
- `FEDIFY_PRIVATE_KEY`: Private key PEM.
- `FEDIFY_PUBLIC_KEY`: Public key PEM (optional, can be derived).

Add these in Cloudflare Dashboard > Pages > your project > Settings > Environment variables.

### 6. Sync Blog Posts

After deploying, trigger the sync endpoint to populate D1:

```bash
curl -X POST https://inferente.com/api/sync -H "Authorization: Bearer <SYNC_TOKEN>"
```

You can automate this in your CI/CD pipeline (GitHub Actions) after each successful build.

### 7. Rate Limiting

Configure rate‑limiting rules in Cloudflare Dashboard for `/inbox` to prevent abuse.

### 8. Test with Fediverse

1. Ensure your domain (`inferente.com`) is accessible.
2. Search for `@azer0@inferente.com` on Mastodon/Pleroma.
3. The instance should discover your actor and allow following.
4. New blog posts should appear in the outbox and be delivered to followers.

## Development Notes

- Local testing: Use `wrangler dev` to run the project with D1/KV bindings.
- The inbox currently accepts any POST and logs it; you need to implement proper handling (Follow, Like, Announce, etc.) using Fedify's `InboxListener`.
- The outbox reads from the `posts` table; each build should call the sync endpoint to keep it updated.
- For a full Fedify integration, replace the manual endpoints with Fedify's `Federation` router (see `src/functions/_lib/federation.ts` skeleton).

## Next Steps (Phase 8)

- RSS feed generation.
- Sitemap configuration.
- SEO meta tags.
- `robots.txt`.

Refer to `plan.md` for the complete roadmap.

## Troubleshooting

- **Build fails with wrangler.toml errors**: Ensure all placeholder IDs are replaced or removed.
- **DB binding not available**: The binding is only available when deployed to Cloudflare or when using `wrangler dev`.
- **Activities not appearing**: Check D1 data, ensure sync endpoint ran successfully.
- **WebFinger not working**: Verify the `/.well-known/webfinger` endpoint responds with correct JSON for `acct:azer0@inferente.com`.

## Files Created

- `src/pages/.well-known/webfinger.ts`
- `src/pages/actor.ts`
- `src/pages/inbox.ts`
- `src/pages/outbox.ts`
- `src/pages/followers.ts`
- `src/pages/following.ts`
- `src/pages/api/sync.ts`
- `wrangler.toml`
- `migrations/0001_initial.sql`
- `ACTIVITYPUB_SETUP.md` (this file)

---

If you encounter issues, consult the [Fedify documentation](https://fedify.dev/) or the [Cloudflare Workers documentation](https://developers.cloudflare.com/workers/).
