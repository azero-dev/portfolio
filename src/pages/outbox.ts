import type { APIRoute } from 'astro';

interface D1PreparedStatement {
  bind(...params: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<{ results?: T[] }>;
  run(): Promise<{ success: boolean }>;
}

interface D1Database {
  prepare(query: string): D1PreparedStatement;
}

interface PostRow {
  ap_id: string;
  content: string;
  title: string;
  published: string;
  updated: string | null;
  slug: string;
}

interface Activity {
  '@context': string;
  id: string;
  type: string;
  actor: string;
  published: string;
  to: string[];
  cc: string[];
  object: {
    id: string;
    type: string;
    attributedTo: string;
    content: string;
    name: string;
    published: string;
    updated?: string;
    url: string;
    to: string;
  };
}

export const GET: APIRoute = async () => {
  // Try to get DB binding
  const db = (import.meta.env as unknown as { DB?: D1Database }).DB;

  let items: Activity[] = [];
  let totalItems = 0;

  if (db) {
    try {
      const result = await db.prepare('SELECT * FROM posts ORDER BY published DESC').all<PostRow>();
      const posts = result.results || [];
      totalItems = posts.length;

      items = posts.map((post: PostRow) => ({
        '@context': 'https://www.w3.org/ns/activitystreams',
        id: `${post.ap_id}/activity`,
        type: 'Create',
        actor: 'https://inferente.com/actor',
        published: post.published,
        to: ['https://www.w3.org/ns/activitystreams#Public'],
        cc: ['https://inferente.com/followers'],
        object: {
          id: post.ap_id,
          type: 'Article',
          attributedTo: 'https://inferente.com/actor',
          content: post.content,
          name: post.title,
          published: post.published,
          updated: post.updated || undefined,
          url: `https://inferente.com/post/${post.slug}`,
          to: 'https://www.w3.org/ns/activitystreams#Public',
        },
      }));
    } catch (error) {
      console.error('Failed to fetch posts from D1:', error);
    }
  }

  const collection = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: 'https://inferente.com/outbox',
    type: 'OrderedCollection',
    totalItems,
    orderedItems: items,
  };

  return new Response(JSON.stringify(collection), {
    status: 200,
    headers: {
      'Content-Type': 'application/activity+json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
