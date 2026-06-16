const ALLOWED_ORIGIN = '*';
const BASE = 'https://api.football-data.org/v4';

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const url = new URL(request.url);
    // Strip leading /api prefix, forward the rest to football-data.org
    const apiPath = url.pathname.replace(/^\/api/, '');
    const apiUrl = `${BASE}${apiPath}${url.search}`;

    const resp = await fetch(apiUrl, {
      headers: { 'X-Auth-Token': env.FD_API_KEY },
    });

    const body = await resp.text();
    return new Response(body, {
      status: resp.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
        'Cache-Control': 'public, max-age=60', // cache 60s to stay within rate limits
      },
    });
  },
};
