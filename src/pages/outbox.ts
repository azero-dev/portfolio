import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  // Try to get DB binding
  const db = (import.meta as any).env?.DB;

  let items = [];
  let totalItems = 0;

  if (db) {
    try {
      const result = await db.prepare('SELECT * FROM posts ORDER BY published DESC').all();
      const posts = result.results || [];
      totalItems = posts.length;

      items = posts.map((post: any) => ({
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
