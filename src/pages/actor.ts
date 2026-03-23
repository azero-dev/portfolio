import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const actor = {
    '@context': ['https://www.w3.org/ns/activitystreams', 'https://w3id.org/security/v1'],
    id: 'https://inferente.com/actor',
    type: 'Person',
    preferredUsername: 'azer0',
    name: 'azer0',
    summary: 'Software engineer building web things. Portfolio and blog.',
    icon: {
      type: 'Image',
      mediaType: 'image/png',
      url: 'https://inferente.com/avatar.png',
    },
    image: {
      type: 'Image',
      mediaType: 'image/png',
      url: 'https://inferente.com/avatar.png',
    },
    inbox: 'https://inferente.com/inbox',
    outbox: 'https://inferente.com/outbox',
    followers: 'https://inferente.com/followers',
    following: 'https://inferente.com/following',
    url: 'https://inferente.com/about',
    publicKey: {
      id: 'https://inferente.com/actor#main-key',
      owner: 'https://inferente.com/actor',
      publicKeyPem: '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...', // Placeholder
    },
  };

  return new Response(JSON.stringify(actor), {
    status: 200,
    headers: {
      'Content-Type': 'application/activity+json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
