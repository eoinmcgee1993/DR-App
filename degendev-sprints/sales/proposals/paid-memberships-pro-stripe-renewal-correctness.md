# DegenDev Proposal: Stripe Renewal Correctness Sprint

**Status:** Internal draft only. Not sent to the prospect.  
**Prospect:** Stranger Studios / Paid Memberships Pro  
**Public reference:** https://github.com/strangerstudios/paid-memberships-pro/issues/3836  
**Proposed delivery:** 5–7 working days after access, scope approval, and a reproducible test environment  
**Indicative fixed fee:** US$2,500–$4,000, subject to a short technical scoping call

## Outcome

When a member updates billing details, the next Stripe subscription renewal should create a Paid Memberships Pro renewal order with the updated billing information. The existing billing workflow should persist the expected order data and remain covered by regression tests.

The public issue describes a specific precedence problem: the Customer address is updated, but the PaymentMethod billing address can remain stale and take precedence when renewal order data is built. It also identifies a separate persistence gap in the existing order row. This proposal is limited to validating and correcting that path.

## Included scope

1. Reproduce the Billing page address-update → subsequent renewal-order flow in a safe test environment.
2. Trace the gateway update, PaymentMethod billing details, Customer address, and local order persistence.
3. Implement the smallest safe correction consistent with PMPro's existing architecture and Stripe API behaviour.
4. Add regression coverage for:
   - Updating billing address through the Billing page.
   - Verifying the intended address is reflected in the relevant Stripe billing objects.
   - Simulating a successful subscription renewal and asserting the new PMPro order uses the updated address.
   - Reloading the persisted order and confirming its billing columns match the update.
   - Relevant fallback behaviour when PaymentMethod address details are absent.
5. Run the focused test suite and any agreed adjacent checks.
6. Deliver a concise change summary, test evidence, deployment notes, and rollback guidance.

## Acceptance criteria

- The updated billing address is used by the next generated renewal order in the agreed test scenario.
- The relevant local order data is persisted and remains correct after reload.
- Regression tests cover the reported failure path and relevant fallback.
- No raw payment-card data is introduced or stored by the change.
- The client receives the code changes and test evidence for review before production release.

## Explicit exclusions

- Rewriting the Stripe gateway or membership billing architecture.
- General payment reliability work unrelated to this address path.
- Bulk repair of historical orders or customer records.
- Production deployment without client approval.
- Changes to other payment gateways unless separately scoped.
- Ongoing maintenance or an open-ended retainer.

## Delivery and commercial terms

- Fixed fee is confirmed only after access and testability are reviewed.
- Suggested payment schedule: 50% at kickoff, 50% after acceptance in the agreed test environment.
- Any additional defect discovered outside the scope will be documented and quoted separately before work proceeds.
- Client retains ownership of project-specific deliverables after full payment; third-party and existing project licenses remain unchanged.

## Suggested opening

I came across issue #3836 describing a mismatch between the updated Stripe Customer address and the PaymentMethod billing details used when PMPro builds a renewal order. The issue also notes that the existing order row may not be persisted on the billing-update path.

DegenDev handles narrowly scoped engineering sprints. I'd propose isolating that update-to-renewal path, correcting the state persistence, and adding regression tests for the next renewal and the reloaded order. If the issue is still active and useful to address, I can send a fixed-scope plan after confirming the current reproduction and test setup.

## Before any outreach

- Recheck issue state and recent commits/PRs.
- Confirm the issue remains unassigned and unresolved.
- Identify the right technical owner and preferred contact route.
- Validate the reproduction and test environment.
- Confirm budget and acceptance expectations.

**No contact has been made. This document is a proposal draft, not a representation of an agreed engagement.**
