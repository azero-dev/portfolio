import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

export const POST: APIRoute = async ({ request }) => {
  // Check secret token
  const authHeader = request.headers.get('Authorization');
  const expectedToken = import.meta.env.SYNC_TOKEN;
  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get all blog posts
    const posts = await getCollection('blog', ({ data }) => !data.draft);

    // Access D1 database (if available)
    const db = (import.meta.env as unknown as { DB?: D1Database }).DB;
    if (!db) {
      console.warn('DB binding not available');
      return new Response(JSON.stringify({ message: 'DB not available', count: posts.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let inserted = 0;
    for (const post of posts) {
      const apId = `https://inferente.com/post/${post.id}`;
      const existing = await db
        .prepare('SELECT id FROM posts WHERE slug = ?')
        .bind(post.id)
        .first<{ id: number }>();

      if (!existing) {
        await db
          .prepare(
            'INSERT INTO posts (slug, ap_id, title, content, published, updated) VALUES (?, ?, ?, ?, ?, ?)'
          )
          .bind(
            post.id,
            apId,
            post.data.title,
            post.body || '', // Note: post.body may not be available
            post.data.pubDate.toISOString(),
            post.data.updatedDate?.toISOString() || null
          )
          .run();
        inserted++;
      }
    }

    return new Response(
      JSON.stringify({
        message: 'Sync completed',
        total: posts.length,
        inserted,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
