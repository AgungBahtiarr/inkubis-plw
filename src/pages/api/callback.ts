// src/pages/api/callback.ts

import type { APIRoute } from 'astro';
import { config, Provider } from '../../lib/config';

export const get: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const host = url.host;
  const urlParams = url.searchParams;
  const code = urlParams.get('code');
  const provider = urlParams.get('provider') as Provider;

  try {
    if (!code) throw new Error(`Missing code`);
    if (!provider) throw new Error(`Missing provider`);

    const providerConfig = config[provider];
    if (!providerConfig) throw new Error(`Invalid provider: ${provider}`);

    const tokenResponse = await fetch(providerConfig.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        client_id: providerConfig.clientId,
        client_secret: providerConfig.clientSecret,
        code: code,
        redirect_uri: `https://${host}/api/callback?provider=${provider}`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`HTTP error! status: ${tokenResponse.status}`);
    }

    const data = await tokenResponse.json();
    const token = data.access_token;

    const responseBody = renderBody('success', {
      token,
      provider,
    });

    return new Response(responseBody, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(renderBody('error', e instanceof Error ? e : new Error(String(e))), {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
};

function renderBody(
  status: string,
  content: {
    token?: string;
    provider?: string;
  } | Error
) {
  let contentString = JSON.stringify(content);
  if (content instanceof Error) {
    contentString = JSON.stringify({ error: content.message });
  }

  return `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:${(content as any).provider}:${status}:${contentString}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:${(content as any).provider}", "*");
    </script>
  `;
}
