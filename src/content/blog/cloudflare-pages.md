---
title: 'Deploying Astro to Cloudflare Pages with D1 and KV'
description: 'A comprehensive guide to deploying Astro applications on Cloudflare Pages with database and storage integration'
pubDate: 2024-03-05
tags: ['cloudflare', 'deployment', 'astro', 'database']
draft: false
---

# Cloudflare Pages Deployment Guide

Cloudflare Pages offers an excellent platform for deploying Astro applications with built-in edge computing capabilities.

## Why Cloudflare Pages?

- **Global CDN** - Content delivered from the edge
- **Automatic HTTPS** - SSL certificates included
- **Built-in Analytics** - Privacy-focused analytics
- **D1 Database** - Edge SQLite database
- **KV Storage** - Key-value storage at the edge
- **Workers Integration** - Serverless functions

## Configuration Steps

### 1. Install Cloudflare Adapter

```bash
npm run astro add cloudflare
```

### 2. Configure astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  adapter: cloudflare({
    imageService: 'cloudflare-binding',
    imagesBindingName: 'IMAGES',
    sessionKVBindingName: 'SESSION',
  }),
  output: 'server',
  site: 'https://your-domain.com',
});
```

### 3. Set Up D1 Database

Create a schema in `migrations/`:

```sql
-- migrations/0001_initial.sql
CREATE TABLE posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 4. Deploy with Wrangler

```bash
npx wrangler pages deploy dist
```

## Performance Benefits

- Edge-rendered content
- Automatic image optimization
- Zero cold starts for Workers
- Global low-latency delivery

## Cost Considerations

- Free tier: 100,000 requests/day
- D1: 5GB database storage free
- KV: 1GB storage free
- Workers: 100,000 requests/day free

## Conclusion

Cloudflare Pages provides a powerful, cost-effective platform for modern web applications.
