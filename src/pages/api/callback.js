export async function get({ request }) {
  const clientId = 'Ov23liwuWAzat6xSDN1o';
  const clientSecret = '253e4989e36f7d876f6127123f24072073a445d7';

  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const provider = searchParams.get('provider');

  if (!code || !provider) {
    return new Response('Error: Missing code or provider', { status: 400 });
  }

  const tokenResponse = await fetch(
    `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${code}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    }
  );

  if (!tokenResponse.ok) {
    return new Response('Error: Failed to retrieve access token', { status: 500 });
  }

  const result = await tokenResponse.json();

  return new Response(null, {
    status: 302,
    headers: {
      'Location': `/admin/#${provider}=${result.access_token}`,
    },
  });
}
