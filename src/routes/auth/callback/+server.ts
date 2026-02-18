import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { workos, workosClientId } from '$lib/server/workos';
import type { RequestHandler } from './$types';
import { convexClient } from '$lib/server/convex';
import { api } from '../../../../convex/_generated/api';

export const GET: RequestHandler = async ({ url }: RequestEvent) => {
    const code = url.searchParams.get('code');

    if (!code) {
        throw error(400, 'No code provided');
    }

    try {
        const { user } = await workos.userManagement.authenticateWithCode({
            code,
            clientId: workosClientId,
        });

        // Sync user to Convex
        await convexClient.mutation(api.users.store, {
            tokenIdentifier: user.id,
            email: user.email,
            firstName: user.firstName ?? undefined,
            lastName: user.lastName ?? undefined,
            profilePictureUrl: user.profilePictureUrl ?? undefined,
        });

        // Set the cookie for client-side auth check
        // The cookie name must match what is checked in +layout.svelte
        url.searchParams.delete('code'); // Clean up URL

        // We use the WorkOS User ID as the token identifier
        const headers = new Headers();
        // Remove HttpOnly so client JS can read it for the auth guard
        headers.append('Set-Cookie', `convex_auth_user=${user.id}; Path=/; SameSite=Lax; Max-Age=2592000`); // 30 days
        headers.append('Location', '/');

        return new Response(null, {
            status: 302,
            headers
        });



    } catch (err) {
        console.error(err);
        throw error(500, 'Authentication failed');
    }

    // Workaround since we need to investigate how to get the JWT for Convex.
    // For now let's just redirect to home and assume we can figure out the token part.
    // throw redirect(302, '/'); // Handled above
};
