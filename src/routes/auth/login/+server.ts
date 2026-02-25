import { redirect } from '@sveltejs/kit';
import { workos, workosClientId, workosRedirectUri } from '$lib/server/workos';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const authorizationUrl = await workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: workosClientId,
        redirectUri: workosRedirectUri,
    });

    throw redirect(302, authorizationUrl);
};
