// This file is the Next.js instrumentation hook (stable since Next.js 14.0.4).
// It is called once when a new server instance is initiated.
// https://nextjs.org/docs/app/guides/instrumentation

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Automatically captures all unhandled server-side request errors.
// Requires @sentry/nextjs >= 8.28.0 and Next.js 15+
export { captureRequestError as onRequestError } from "@sentry/nextjs";
