import { WorkOS } from '@workos-inc/node';
import { env } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const apiKey = env.WORKOS_API_KEY || '';
const clientId = publicEnv.PUBLIC_WORKOS_CLIENT_ID || '';
const redirectUri = env.WORKOS_REDIRECT_URI || '';

if (!apiKey) {
    console.error("WORKOS_API_KEY is not set in environment variables");
}

export const workos = apiKey ? new WorkOS(apiKey) : new WorkOS({ clientId });
export const workosClientId = clientId;
export const workosRedirectUri = redirectUri;
