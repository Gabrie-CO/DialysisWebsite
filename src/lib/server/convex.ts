import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';

// We use the public URL to create the client
export const convexClient = new ConvexHttpClient(PUBLIC_CONVEX_URL);
