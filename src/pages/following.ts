import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const collection = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: 'https://inferente.com/following',
    type: 'OrderedCollection',
    totalItems: 0,
    orderedItems: [],
  };

  return new Response(JSON.stringify(collection), {
    status: 200,
    headers: {
      'Content-Type': 'application/activity+json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
