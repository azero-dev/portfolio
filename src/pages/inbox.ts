import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const collection = {
    '@context': 'https://www.w3.org/ns/activitystreams',
    id: 'https://inferente.com/inbox',
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

// Accept POST requests for incoming activities
export const POST: APIRoute = async ({ request }) => {
  // For now, just acknowledge receipt
  console.log('Received activity in inbox:', await request.text());
  return new Response(null, {
    status: 202,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
};
