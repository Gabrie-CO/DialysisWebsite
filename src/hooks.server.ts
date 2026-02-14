import { handleErrorWithSentry, sequence } from "@sentry/sveltekit";
import * as Sentry from "@sentry/sveltekit";

Sentry.init({
    dsn: "YOUR_SENTRY_DSN_HERE", // Replace with your actual DSN
    tracesSampleRate: 1.0,
});

export const handleError = handleErrorWithSentry();
