// src/lib/config.ts

export type Provider = 'github' | 'gitlab' | 'bitbucket';

interface ProviderConfig {
  authorizationUrl: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
}

export const config: Record<Provider, ProviderConfig> = {
  github: {
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    clientId: import.meta.env.GITHUB_CLIENT_ID,
    clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
  },
  gitlab: {
    authorizationUrl: 'https://gitlab.com/oauth/authorize',
    tokenUrl: 'https://gitlab.com/oauth/token',
    clientId: import.meta.env.GITLAB_CLIENT_ID,
    clientSecret: import.meta.env.GITLAB_CLIENT_SECRET,
  },
  bitbucket: {
    authorizationUrl: 'https://bitbucket.org/site/oauth2/authorize',
    tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
    clientId: import.meta.env.BITBUCKET_CLIENT_ID,
    clientSecret: import.meta.env.BITBUCKET_CLIENT_SECRET,
  },
};
