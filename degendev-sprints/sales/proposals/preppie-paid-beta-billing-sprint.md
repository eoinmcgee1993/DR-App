# DegenDev Proposal: Preppie Paid Beta Billing Sprint

**Status:** Internal draft only. Not sent to the prospect.  
**Prospect:** AxiomaSystems / Preppie  
**Public reference:** https://github.com/AxiomaSystems/Chef/issues/118  
**Proposed delivery:** 7–10 working days after scope, access, and test setup are agreed  
**Indicative fixed fee:** US$3,500–$5,500, subject to a short technical scoping call

## Outcome

Deliver the minimum reliable Stripe subscription lifecycle needed for Preppie's paid beta, with Stripe handling payment collection and a normalized local subscription projection controlling product entitlements.

The public issue describes the required lifecycle, including customer mapping, Checkout, Customer Portal, verified webhooks, idempotency, subscription persistence, failure/cancellation policies, reconciliation, and test-mode lifecycle coverage. This proposal is intentionally limited to the beta requirements already described in that issue.

## Included scope

1. Review the current authentication, user model, payment-related fields, and existing related work, including the dependency on issue #83.
2. Define the minimum billing-state model and mapping between one Preppie user and one Stripe Customer.
3. Configure Stripe-hosted Checkout for the approved founding monthly plan, with provider IDs supplied through environment configuration rather than hard-coded.
4. Add Customer Portal entry points for payment-method updates, cancellation, and invoice access where supported by the agreed configuration.
5. Implement signed webhook verification and persistent event idempotency.
6. Implement the agreed lifecycle events and transactional updates to the local subscription projection.
7. Define and implement only the beta-approved entitlement policy for active, past-due, unpaid, canceled, incomplete, paused, trial, and reactivated states.
8. Add a reconciliation command or job that compares local subscription state with Stripe, with safe reporting and no surprise writes.
9. Add test-mode lifecycle coverage for checkout, activation, renewal/payment failure, cancellation, reactivation, duplicate/out-of-order events, and reconciliation.
10. Document separate test/live configuration, webhook setup, secret rotation, local development, deployment, and rollback.

## Acceptance criteria

- A user can complete Stripe-hosted Checkout without Preppie receiving or storing raw card details.
- Paid access is granted only after verified server-side billing state or an explicit reconciliation path, never from a browser redirect alone.
- Duplicate, delayed, retried, and out-of-order webhook events do not corrupt subscription state.
- The agreed beta policies for payment failure, cancellation, reactivation, refund/dispute handling, and trial expiration are documented and tested.
- Test and live Stripe resources are isolated and environment-specific IDs are not hard-coded.
- The local subscription projection can be compared against Stripe using the agreed reconciliation workflow.
- Annual billing remains disabled unless the product owner explicitly approves it based on retention and cost evidence.
- A test report and handover notes are delivered before production activation.

## Explicit exclusions

- Building a custom payment processor or handling raw card data.
- App Store or Google Play in-app purchases.
- Annual plans at initial beta launch.
- Final pricing strategy, usage-limit economics, or unlimited voice-usage guarantees.
- Broad entitlement/usage-accounting redesign beyond the minimum billing integration.
- Privacy/terms work tracked separately in issue #99, account/session work tracked separately in #91/#98, or account-deletion work tracked separately in #100, except for explicitly agreed integration touchpoints.
- Production activation without client approval.
- Ongoing maintenance or a retainer.

## Delivery and commercial terms

- The fee is indicative only. Confirm scope after checking the current branch, dependencies, and testability.
- Suggested payment schedule: 40% at kickoff, 40% when the test-mode lifecycle passes agreed acceptance tests, 20% at handover.
- Third-party Stripe fees and any additional vendor costs are excluded.
- Any scope expansion is quoted and approved before work proceeds.
- Client retains ownership of project-specific deliverables after full payment; third-party and existing project licenses remain unchanged.

## Suggested opening

I reviewed issue #118 describing the billing lifecycle needed for Preppie's paid beta. The scope is unusually clear: Stripe-hosted checkout, a normalized local subscription record, verified and idempotent webhooks, explicit entitlement policies, and lifecycle tests.

DegenDev delivers fixed-scope engineering sprints. I'd suggest implementing only the minimum monthly billing lifecycle required for the beta, with annual billing left disabled and a test report covering failure, cancellation, reactivation, and duplicate event delivery. If the work is still unassigned, the next step would be a short scope and budget check before committing to a fixed fee.

## Before any outreach

- Recheck issue state, assignees, recent commits/PRs, and related issue #83.
- Identify the current billing owner and confirm their authority to engage outside help.
- Verify the present stack and remaining work rather than assuming every checklist item is untouched.
- Confirm whether the paid beta is still planned and whether a US$3,500–$5,500 external sprint is realistic.
- Agree on the precise beta lifecycle policy before estimating delivery.

**No contact has been made. This document is a proposal draft, not a representation of an agreed engagement.**
