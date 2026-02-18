import { redirect } from '@sveltejs/kit';
import { workos, workosClientId } from '$lib/server/workos';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    const authorizationUrl = await workos.userManagement.getAuthorizationUrl({
        provider: 'authkit',
        clientId: workosClientId,
        redirectUri: 'http://localhost:5173/auth/callback',
    });

    throw redirect(302, authorizationUrl);
};
