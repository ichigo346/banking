---
target: app/(root)/page.tsx
total_score: 24
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 1
timestamp: 2026-08-22T09-09-40Z
slug: app-root-page-tsx
---
# Design Critique Report: Horizon Banking App

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Async form submission has loader, but table filtering and bank account sync lacks real-time status indicators |
| 2 | Match System / Real World | 4 | Clear financial domain terminology (credit/debit, routing number, balance, transfers) |
| 3 | User Control and Freedom | 2 | No confirmation modal before sending transfers; missing filter clear actions on transaction history |
| 4 | Consistency and Standards | 3 | Consistent 3-column shell, but arbitrary font utility drift (`text-[16px]` vs `text-16`) across components |
| 5 | Error Prevention | 2 | Good Zod validation on inputs, but no double-confirmation on high-stakes payment transfers |
| 6 | Recognition Rather Than Recall | 3 | Visible sidebar labels and bank cards, though active bank selection relies on subtle query parameters |
| 7 | Flexibility and Efficiency | 1 | Zero keyboard shortcuts for power users; no quick-transfer or batch actions |
| 8 | Aesthetic and Minimalist Design | 3 | Clean layout with generous whitespace; minor custom scrollbar style noise |
| 9 | Error Recovery | 2 | AuthForm provides clear field error hints, but transfer failure paths rely on generic fallback text |
| 10 | Help and Documentation | 1 | Header subtexts offer brief context, but no inline tooltips explain Dwolla/Plaid processing windows |
| **Total** | | **24/40** | **Acceptable** |

## Design Specificity Verdict

**LLM Assessment**: Horizon's design is well-grounded in modern fintech conventions. The tri-column layout, stacked bank card pattern, and strict font separation between IBM Plex Serif (brand/amounts) and Inter (interface) give it a distinct identity. However, the interface feels rigid for power users and lacks reassuring feedback during high-stakes actions like money transfers.

**Deterministic scan**: Automated scan (`detect.mjs`) flagged 13 advisory findings across `app/globals.css`, `components/PlaidLink.tsx`, and `components/ui/button.tsx`:
- **Font size drift**: 8 instances of arbitrary `text-[16px]` or `text-[0.8rem]` overriding the standard `DESIGN.md` type ramp.
- **Undocumented colors**: `globals.css` scrollbar styles use un-tokenized raw colors (`#dddddd`, `#5c5c7b`, `#7878a3`).
- **Undocumented radius**: `globals.css` uses arbitrary radius values (`2px`, `50px`) outside the `DESIGN.md` rounded scale.

**Visual overlays**: No browser overlay active (ran via CLI detector scan).

## Overall Impression

Horizon presents a clean, trustworthy foundation with strong visual hierarchy. The core experience is solid, but it needs production hardening around error prevention (transfer confirmation), accessibility, and keyboard efficiency before it feels like a top-tier banking app.

## What's Working

1. **Signature Bank Card Component**: The stacked card visualization with Plaid integration, card texture lines, and brand marks makes multi-bank management intuitive.
2. **Clear Typography Hierarchy**: Explicit separation between IBM Plex Serif for financial numbers/logos and Inter for functional UI maintains brand authority.
3. **Structured Tri-Column Shell**: The layout remains predictable across authenticated routes, keeping the user oriented at all times.

## Priority Issues

1. **[P1] Unprotected High-Stakes Action**: Sending a payment transfer executes immediately upon button click without a review/confirmation modal or summary step.
   - *Why it matters*: Accidental transfers cannot be undone easily in banking applications; users require a moment of confirmation.
   - *Fix*: Add a two-step confirmation dialog or review summary before dispatching the Dwolla transfer.
   - *Suggested command*: `/impeccable harden`

2. **[P2] Missing Power-User Accelerators**: Zero keyboard shortcuts or quick-action triggers exist for power users managing multiple transfers or switching accounts.
   - *Why it matters*: Frequent users are forced into repetitive mouse clicks for routine banking operations.
   - *Fix*: Implement keyboard navigation (`Cmd+K` palette or `T` shortcut for transfer) and focus traps.
   - *Suggested command*: `/impeccable adapt`

3. **[P2] Design System Token Drift**: Arbitrary text utility sizes (`text-[16px]`) and un-tokenized scrollbar styles bypass the established `DESIGN.md` tokens.
   - *Why it matters*: Hardcoded pixel values create subtle layout misalignment and make global styling updates fragile.
   - *Fix*: Refactor arbitrary values in `globals.css` and components to match the `DESIGN.md` token scale.
   - *Suggested command*: `/impeccable polish`

4. **[P3] Lack of Transfer Expectation & Guidance**: The payment transfer page does not clarify processing times (e.g. 1-3 business days for ACH) or cutoff limits.
   - *Why it matters*: First-time users are uncertain when funds will arrive or whether their transfer succeeded immediately.
   - *Fix*: Add contextual helper callouts and estimated delivery timestamps to the transfer form.
   - *Suggested command*: `/impeccable clarify`

## Persona Red Flags

- **Alex (Impatient Power User)**: No keyboard shortcuts for navigation or submit (`Cmd+Enter`). Selecting bank accounts and initiating transfers requires multiple round-trip page clicks. High frustration risk for daily management.
- **Jordan (Confused First-Timer)**: No clear indication of how long a Dwolla/ACH transfer takes to clear. The "Recipient Email" vs "Bank Account" transfer distinction is not explained inline.
- **Sam (Accessibility-Dependent User)**: Focus states on bank cards and custom input wrappers rely on default browser outlines; dark background text contrast in category badges needs verification against WCAG AA 4.5:1.

## Minor Observations

- Custom scrollbar styles in `globals.css` use hardcoded gray/purple hex values instead of Tailwind color variables.
- Bank Card balance masking toggle (`showBalance`) is inconsistently exposed between the sidebar preview and full `/my-banks` route.
