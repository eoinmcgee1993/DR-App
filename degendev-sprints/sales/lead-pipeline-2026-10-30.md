# DegenDev Sprint Lead Pipeline

**Updated:** 30 October 2026  
**Purpose:** Internal lead tracking only. No prospects contacted.

## Active priority

| Priority | Prospect | Public issue | Verified status | Opportunity | Next action |
|---|---|---|---|---|---|
| 1 | Paid Memberships Pro / Stranger Studios | https://github.com/strangerstudios/paid-memberships-pro/issues/3836 | Open, unassigned, last updated 28 Sep 2026 in the issue payload checked on 30 Oct | Fix billing address update → Stripe PaymentMethod/customer state → renewal order persistence; regression tests | Validate exact current branch/PR state, identify technical owner, use proposal draft |
| 2 | Preppie / AxiomaSystems | https://github.com/AxiomaSystems/Chef/issues/118 | Open, unassigned, last updated 17 Jul 2026 in the issue payload checked on 30 Oct | Minimum reliable Stripe billing lifecycle for paid beta | Check related issue #83, implementation progress, product status, decision-maker and budget; use proposal draft |
| Monitor | AI Shipping Labs | https://github.com/AI-Shipping-Labs/website/issues/1414 | Closed as completed 12 Aug 2026 in the issue payload checked on 30 Oct | Original CLI reconciliation-report work is complete | Remove from active pipeline for this offer; monitor only for a new, independently verified need |

## Proposal drafts

- [Paid Memberships Pro: Stripe Renewal Correctness Sprint](./proposals/paid-memberships-pro-stripe-renewal-correctness.md)
- [Preppie: Paid Beta Billing Sprint](./proposals/preppie-paid-beta-billing-sprint.md)

## Indicative fees, not quotes

- Paid Memberships Pro: US$2,500–$4,000 for an estimated 5–7 working days.
- Preppie: US$3,500–$5,500 for an estimated 7–10 working days.

These ranges are internal hypotheses only. Confirm the scope, buyer budget, access, and acceptance criteria before issuing any quote.

## Verification notes

### Paid Memberships Pro
The issue body identifies a specific precedence problem: PMPro updates the Stripe Customer address but does not update PaymentMethod billing_details.address; renewal order construction prefers the PaymentMethod address over the Customer address. It also identifies that the billing update path calls updateBilling() without persisting the local order row via saveOrder(). Suggested regression tests cover a Billing page update, a simulated invoice.payment_succeeded, the new renewal order, and reloading the saved order.

### Preppie
Issue #118 describes a complete paid-beta billing requirement, including Stripe-hosted Checkout and Customer Portal, a normalized local subscription projection, verified/idempotent webhooks, lifecycle policy, reconciliation, and test/live environment separation. The issue explicitly says annual billing should remain disabled initially. Budget and purchasing authority are not confirmed.

### AI Shipping Labs
Issue #1414 is closed with state reason completed. Do not pitch the same reconciliation report as unfinished work. The earlier research opportunity is closed.

## Guardrails
- No outreach, forms, or spending has occurred.
- Do not present an open GitHub issue as proof that no work has started elsewhere.
- Recheck linked pull requests and recent commits before contacting a prospect.
- Do not claim a prospect has budget, an unresolved production incident, or a desire to hire DegenDev without evidence.
- Never include secrets, credentials, or private customer data in these files.
