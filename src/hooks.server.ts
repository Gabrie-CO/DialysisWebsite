import { handleErrorWithSentry } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
    dsn: import.meta.env.PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
});

export const handleError = handleErrorWithSentry();
