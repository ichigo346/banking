---
target: app/(root)/payment-transfer/page.tsx
total_score: 23
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 2
timestamp: 2026-08-31T12-44-41Z
slug: app-root-payment-transfer-page-tsx
---
# Critique: Payment Transfer Surface

Method: DEGRADED single-context (no sub-agent tool)
Target: app/(root)/payment-transfer/page.tsx
Mode: Operate

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Spinner + error banner present; no step progress indicator |
| 2 | Match System / Real World | 2 | Plaid Sharable ID is raw jargon |
| 3 | User Control and Freedom | 3 | Modal cancel path present; no page breadcrumb |
| 4 | Consistency and Standards | 3 | Minor padding inconsistencies |
| 5 | Error Prevention | 3 | Zod + confirmation modal; no balance check |
| 6 | Recognition Rather Than Recall | 2 | Sharable ID must be recalled/looked up externally |
| 7 | Flexibility and Efficiency | 1 | No shortcuts, saved recipients, or templates |
| 8 | Aesthetic and Minimalist Design | 2 | Right sidebar disconnected from task context |
| 9 | Error Recovery | 3 | Specific error messages; no field-level error highlight |
| 10 | Help and Documentation | 1 | Zero contextual help on any field |
| Total | | 23/40 | Acceptable |

## Priority Issues

### [P1] Plaid Sharable ID is opaque jargon
Fix: Rename + add tooltip + lookup by email flow
Command: /impeccable clarify

### [P1] No available balance shown in source dropdown
Fix: Show masked balance in dropdown + confirmation modal
Command: /impeccable harden

### [P2] Right sidebar disconnected from transfer context
Fix: Replace with transfer history / ETA / limits on this route
Command: /impeccable layout

### [P2] No step/progress indicator for 2-step flow
Fix: Add step pip above form header
Command: /impeccable animate

### [P2] No contextual help anywhere
Fix: Add tooltips on Sharable ID + Amount; How does this work? section
Command: /impeccable clarify

## Minor Observations
- Inconsistent form section padding
- Modal X button missing aria-label
- Transfer Note field above recipient fields (non-standard order)
- bg-blue-25/50 is custom token - verify theme resolution
- Modal missing role=dialog and aria-modal=true
