import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const resource = url.searchParams.get('resource');

  // Handle webfinger request for azer0@inferente.com
  if (resource === 'acct:azer0@inferente.com') {
    return new Response(
      JSON.stringify({
        subject: 'acct:azer0@inferente.com',
        links: [
          {
            rel: 'self',
            type: 'application/activity+json',
            href: 'https://inferente.com/actor',
          },
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: 'text/html',
            href: 'https://inferente.com/about',
          },
          {
            rel: 'http://webfinger.net/rel/avatar',
            href: 'https://inferente.com/avatar.png',
          },
        ],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/jrd+json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // Not found
  return new Response(JSON.stringify({ error: 'Not Found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' },
  });
};
