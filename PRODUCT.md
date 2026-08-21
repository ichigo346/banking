# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Personal banking users who want a single place to monitor and act on all their bank accounts. Primary job: see consolidated balances, review recent transactions across institutions, and send transfers — without switching between each bank's own app.

## Product Purpose

Horizon is a personal finance dashboard that connects multiple bank accounts through Plaid, giving users one unified view of their money. Success means a user can log in, immediately understand their financial position across all linked institutions, and complete a transfer — without ever opening another app.

## Positioning

Plaid-powered multi-bank aggregation: Horizon links accounts from any Plaid-supported institution into a single authenticated session. A standalone bank's app cannot truthfully replicate this because it only sees its own data.

## Operating Context

- Users log in once per session; Appwrite handles authentication and session persistence.
- Bank connections are established through Plaid Link (OAuth-style flow); tokens are stored server-side.
- Transfers are sent via Dwolla; recipient accounts must be linked first.
- The dashboard is used on desktop; the layout collapses gracefully to mobile but desktop is the primary scene.

## Capabilities and Constraints

- **Authentication:** Appwrite (email/password sign-up and sign-in).
- **Bank linking:** Plaid Link; real or sandbox credentials depending on environment.
- **Fund transfers:** Dwolla; requires a connected funding source.
- **Routes:** `/` (home dashboard), `/my-banks`, `/payment-transfer`, `/transaction-history`, `/sign-in`, `/sign-up`.
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TailwindCSS v3, shadcn/ui (Radix primitives), TypeScript.
- **Rendering:** All authenticated routes are `force-dynamic` (cookie-based auth prevents static prerendering).
- **Error monitoring:** Sentry (client + server + edge).
- **No native mobile app** — mobile web only; platform is `web`.

## Brand Commitments

- Product name: **Horizon**
- Logo asset: `/public/icons/logo.svg`
- Primary typefaces: IBM Plex Serif (wordmark/sidebar logo), Inter (body/UI)
- Color language: blue-dominant gradient (`bg-bank-gradient`), white sidebar, light-gray content backgrounds (`bg-gray-25`)
- Visual tone: clean, professional, trustworthy — not flashy fintech

## Evidence on Hand

- Full working codebase with auth, Plaid, Dwolla, and Sentry integrated.
- UI implemented: sidebar, mobile nav, bank cards, transaction table, doughnut chart, right sidebar with profile and bank summary, payment transfer form.
- No marketing copy, testimonials, pricing, or press assets — do not fabricate any.

## Product Principles

1. **Clarity over cleverness.** Financial data must be scannable at a glance; decoration never competes with numbers.
2. **Trust through consistency.** Every surface follows the same visual language — color, type, spacing — so users feel oriented immediately.
3. **Respect the session.** Auth is real and stateful; never design flows that assume public or cached access.
4. **One action per moment.** Each screen has a single primary job; competing CTAs or mixed intent screens are a failure state.
5. **Multi-bank, single truth.** The value is aggregation; UI must always reinforce that Horizon sees across all linked accounts.
