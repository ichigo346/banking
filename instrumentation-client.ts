// This file configures the initialization of Sentry on the browser (client) side.
// It uses the current Next.js SDK pattern: instrumentation-client.ts
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN ?? "___PUBLIC_DSN___",

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below.
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },

  // 100% in dev, 10% in production
  tracesSampleRate: process.env.NODE_ENV === "development" ? 1.0 : 0.1,

  // Session Replay: 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Enable Sentry Logs product
  enableLogs: true,

  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    // Uncomment to add user feedback widget:
    // Sentry.feedbackIntegration({ colorScheme: "system" }),
  ],

  // Restrict trace header propagation to your own origins
  tracePropagationTargets: [
    "localhost",
    /^\//,
    // Add your production API URL here:
    // /^https:\/\/api\.yourdomain\.com/,
  ],

  // Only enabled in production by default; set to true in dev to test
  enabled: process.env.NODE_ENV === "production",

  environment: process.env.NODE_ENV,
});

// Hook into App Router navigation transitions to create navigation spans
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
