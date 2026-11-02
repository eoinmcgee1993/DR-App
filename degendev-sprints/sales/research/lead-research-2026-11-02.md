# DegenDev Sprint Lead Research
**Verified: 2 November 2026**

## Executive summary

Ten prospects were reviewed against public GitHub issue evidence, product documentation, pricing and API availability. The strongest direct opportunities are **Lago, Stigg and TutorCruncher**. Chronote is a strong founder-led alternative.

Scores are commercial qualification scores, not close probabilities. They weigh commercial evidence, severity and recency of the engineering signal, API/stack clarity, and the likelihood that a bounded sprint can be scoped.

| Rank | Prospect | Score | Qualification |
|---:|---|---:|---|
| 1 | Lago | 9.4 | Strong direct prospect |
| 2 | Stigg | 9.1 | Strong direct prospect |
| 3 | TutorCruncher | 8.6 | Strong, but internal assignee already exists |
| 4 | Chronote | 8.4 | Strong founder-led prospect |
| 5 | Engram | 8.2 | Strong founder-led prospect |
| 6 | Fider Cloud | 8.0 | Good direct prospect |
| 7 | Startline | 7.2 | Pre-launch, conditional |
| 8 | CacheDrop | 7.0 | Early digital product, owner already fixing |
| 9 | Tokoroa Alpine Club | 6.8 | Real membership organisation, budget uncertain |
| 10 | OpenMeter by Kong | 6.6 | Enterprise/OSS lead, API-version caveat |

## 1. Lago
**Score: 9.4/10 | Strong direct prospect**

**Observed pain**
- [Issue #6974](https://github.com/getlago/lago-api/issues/6974), opened 31 October, reproduces a Flutterwave `charge.completed` webhook being acknowledged even when the follow-up verification call fails transiently. The invoice remains pending, no payment is recorded, and no retry job remains. The issue includes a request-spec reproduction.
- [Issue #6903](https://github.com/getlago/lago-api/issues/6903) describes an ambiguous Stripe outcome: Stripe returns HTTP 500 after a payment that actually succeeded, Lago marks the invoice failed, the success webhook cannot find the payment, and a later retry can create a new PaymentIntent and charge the customer again.
- Both issues are open. These are code-level reproductions, not proof that every Lago customer is affected.

**Commercial fit and stack**
Lago offers hosted and self-hosted usage-based billing, subscription management and a public API. The affected paths use Ruby/Rails payment-provider jobs and invoice/payment records, with Stripe and Flutterwave integrations. The public API and provider integrations are documented at [Lago](https://www.getlago.com/) and in the [API documentation](https://doc.getlago.com/).

**Likely decision-maker**
Head of Engineering, payments/billing engineering lead, or product engineering manager.

**Opening angle**
A payment-provider reliability sprint focused on indeterminate outcomes: persist provider event evidence, distinguish definite declines from ambiguous failures, retry transient verification errors, and reconcile provider state before allowing another charge.

**Next check**
Check for a maintainer response or implementation PR on #6974 and #6903. Keep the two failure modes separate in the scope: Flutterwave verification retry versus Stripe post-charge ambiguity.

## 2. Stigg
**Score: 9.1/10 | Strong direct prospect**

**Observed pain**
[Issue #109](https://github.com/stiggio/stigg-typescript/issues/109), opened 1 November, contains a sandbox reproduction where `subscriptions.preview` honours `billingCycleAnchor: NOW` during an immediate plan change, but `subscriptions.provision` behaves as if the anchor were unchanged. The issue reports the mismatch across REST and GraphQL entry points. It is still open.

**Commercial fit and stack**
Stigg sells a subscription, entitlements and usage-metering platform. Its official pricing lists a free Build plan and Pro at $499/month month-to-month or $399/month on annual billing. It supports Stripe and exposes APIs and SDKs. See [Stigg pricing](https://www.stigg.io/pricing) and [Stigg product/API overview](https://www.stigg.io/).

The observed client is the TypeScript SDK against Stigg's API and a Stripe sandbox integration. The reporter says the SDK passes the field through unchanged, so the likely defect is in API provisioning rather than SDK serialization.

**Likely decision-maker**
Product engineering lead or API/SDK engineering lead responsible for subscription lifecycle and billing semantics.

**Opening angle**
A preview-to-provision parity sprint covering immediate plan changes, billing-cycle anchors, proration, invoice line items and period boundaries. Add a shared regression matrix across REST, GraphQL and the TypeScript SDK.

**Next check**
Ask whether the API team has already accepted the reproduction or opened a backend fix. Do not pitch an SDK-only change unless the API behaviour is confirmed correct.

## 3. TutorCruncher
**Score: 8.6/10 | Strong commercial fit, internal work underway**

**Observed pain**
- [Issue #448](https://github.com/tutorcruncher/hermes/issues/448) documents duplicate Pipedrive organisations and inaccurate first-demo reporting. The report lists 55 deals with first demos on two organisations and 15 GB/ROW first demos double-counted in 2026.
- [Issue #456](https://github.com/tutorcruncher/hermes/issues/456), opened 29 October, defines a guarded backfill for booking-only organisations whose country field was not populated.
- [Issue #450](https://github.com/tutorcruncher/hermes/issues/450) is closed and addressed the newer country-field population path. #448 and #456 remain open; #448 already has an internal assignee.

**Commercial fit and stack**
TutorCruncher publishes paid plans from £25/month, with Startup at £60/month and Enterprise at £200/month. It provides a REST API and webhooks. See [official pricing](https://tutorcruncher.com/pricing), [API documentation](https://api.tutorcruncher.com/), and [integration catalogue](https://tutorcruncher.com/integrations).

The Hermes integration repository evidences Python/FastAPI, SQLModel/SQLAlchemy, PostgreSQL and Pipedrive/TutorCruncher API integrations.

**Likely decision-maker**
Head of Engineering or integrations lead, with Revenue Operations as a key stakeholder.

**Opening angle**
A CRM data-integrity sprint: stable source identity, idempotent organisation sync, duplicate detection, safe backfill and analytics deduplication. Avoid changing the existing CRM model until the current assignee's work is understood.

**Next check**
Review the current state of #448 and #456 and the implementation associated with #450. This is only an external-sprint opportunity if the internal owner wants help or the remaining scope is still blocking reliable reporting.

## 4. Chronote
**Score: 8.4/10 | Strong founder-led prospect**

**Observed pain**
[Issue #469](https://github.com/Chronote-gg/Chronote/issues/469) says Stripe disputes and early fraud warnings are not handled. A disputed charge can leave a Discord server on its paid tier and allow renewal to continue. The existing receipt table could support idempotency, but the owner still needs to decide whether a dispute stops renewal at period end or revokes access immediately, and how a won dispute should be treated.

Related [issue #468](https://github.com/Chronote-gg/Chronote/issues/468) records webhook event-configuration and Stripe API-version drift. Both issues remain open.

**Commercial fit and stack**
Chronote is operated by BASIC BIT LLC. Paid plans are billed through Stripe monthly or annually. Its docs describe Basic introductory pricing of $6/month for three months, then $10/month, with higher limits on Pro. See [Chronote](https://chronote.gg/), [billing documentation](https://docs.chronote.gg/features/), and [terms](https://docs.chronote.gg/legal/terms/).

The repository evidences a TypeScript/Node service, Stripe Billing, subscription reconciliation and an AWS SNS email-alert path.

**Likely decision-maker**
Founder/CTO or the technical maintainer responsible for billing and subscription access.

**Opening angle**
A Stripe dispute-lifecycle sprint: handle dispute and early-fraud events, apply an owner-approved renewal/access policy, notify an operator, and reconcile entitlements idempotently. Include an endpoint event-list and API-version audit.

**Next check**
Confirm the intended policy for disputed, won and lost disputes before estimating. Do not assume immediate cancellation is the correct business rule.

## 5. Engram
**Score: 8.2/10 | Strong founder-led prospect**

**Observed pain**
[Issue #2220](https://github.com/engram-app/Engram/issues/2220) reports that a full refund on a Paddle subscription with an existing scheduled cancellation can fail with `subscription_locked_pending_changes`. Repeating the webhook does not fix it. The issue proposes clearing the scheduled change before immediate cancellation. It also identifies a data-model limitation: one subscription row per user cannot distinguish multiple live Paddle subscriptions.

**Commercial fit and stack**
Engram offers Starter at $7/month and Pro at $14/month, with annual plans at $70 and $140. Paddle acts as merchant of record, and Pro includes a REST API. See [official pricing](https://engram.page/pricing) and [feature/API details](https://engram.page/features).

The repository's billing path uses Paddle and local subscription records.

**Likely decision-maker**
Founder or technical maintainer responsible for billing and account lifecycle.

**Opening angle**
A Paddle lifecycle correctness sprint: clear pending scheduled changes before immediate cancellation, model provider subscription IDs independently, and add sandbox tests for refunds, scheduled cancellation, retries and duplicate subscriptions.

**Next check**
Confirm whether the billing review that produced #2220 is still active and whether the schema change for multiple subscriptions has been accepted.

## 6. Fider Cloud
**Score: 8.0/10 | Good direct prospect**

**Observed pain**
[Issue #1740](https://github.com/getfider/fider/issues/1740) reproduces an incomplete Stripe subscription later becoming active after the first invoice is paid. The webhook handler acknowledges `customer.subscription.updated` and `invoice.paid` without activating the tenant or persisting the billing customer mapping. The tenant remains on the free plan, and another checkout can create a second customer/subscription. The issue is open. The reporter says frequency has not been measured.

**Commercial fit and stack**
Fider Cloud has a $25/month Pro plan. The hosted product targets product teams, SaaS businesses and startups. See [official pricing](https://www.fider.io/pricing) and [Fider](https://www.fider.io/).

The affected path is Go, PostgreSQL and Stripe.

**Likely decision-maker**
Founder or engineering lead at Northern App Labs Ltd, the company behind Fider.

**Opening angle**
A first-payment recovery sprint: persist incomplete subscription/customer identity, activate when the first invoice is later paid, reconcile the tenant entitlement and ensure the billing portal can manage the same subscription.

**Next check**
Check for a maintainer response or fix since the issue's last update. Reproduce with a signed Stripe test event before quoting.

## 7. Startline
**Score: 7.2/10 | Pre-launch, conditional**

**Observed pain**
- [Issue #470](https://github.com/StartlineAU/startline-web-app/issues/470), opened 2 November, says Stripe processing fees currently come out of Startline's platform booking fee, while the business decision is that organisers should absorb them. Checkout uses Stripe Connect destination charges and `application_fee_amount`.
- [Issue #445](https://github.com/StartlineAU/startline-web-app/issues/445) identifies event-listing work that loads all events before filtering, sorting and paginating. The proposed direction is to push that work into database queries.
- Important commercial caveat: [issue #335](https://github.com/StartlineAU/startline-web-app/issues/335) says the platform is still in waitlist mode with no real users. Production live checkout has not yet been demonstrated.

**Stack evidenced**
Next.js 16, React 19, PostgreSQL 16, Prisma 7 and Stripe Connect.

**Likely decision-maker**
Founder/product owner and the engineering lead responsible for payments and event discovery.

**Opening angle**
A pre-launch payment and query-performance sprint. Centralise the fee policy, distinguish estimated Stripe fees from actual settled balance-transaction fees, reconcile organiser payouts/refunds, and move filtering/pagination into PostgreSQL with query-parity tests.

**Next check**
Confirm the intended launch date and whether the fee policy is final. Do not pitch this as a production incident or assume there are paying users.

## 8. CacheDrop
**Score: 7.0/10 | Early digital product, owner already fixing**

**Observed pain**
[Issue #76](https://github.com/Patrick-M-Bourget/cachedrop-website/issues/76), opened 2 November, says the first live purchase on 1 November did not produce a license key because the Stripe webhook returned 503 when the Supabase Edge Function's `issue_license` call failed. The function did not log the underlying RPC error, making diagnosis harder.

The owner has already opened a live-mode rollout task in [issue #652](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/652) and a licensing/checkout task in [issue #591](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/591).

**Commercial fit and stack**
CacheDrop is a macOS digital product with a one-time license price of $19.99, discounted from a $29.99 base price. Subscriptions are explicitly deferred. The documented stack is Stripe Payment Links, Supabase Edge Functions, Ed25519 license signing and Resend.

**Likely decision-maker**
Solo founder/product maintainer. Formal title is not independently confirmed.

**Opening angle**
A small license-fulfilment reliability sprint: structured non-secret error logging, idempotent license issuance, a replayable failed-delivery path, and test/live configuration checks.

**Next check**
Do not duplicate the owner's active fix. Requalify only after the current live purchase and refund acceptance tests have passed. The low one-time price makes a large sprint commercially unlikely.

## 9. Tokoroa Alpine Club
**Score: 6.8/10 | Membership organisation, budget uncertain**

**Observed pain**
[Issue #98](https://github.com/triyder/AlpineClubBookingsNZ/issues/98), opened 2 November, describes a setup-wizard deadlock after an authentication-secret rotation. If the old Stripe webhook signing secret cannot be decrypted, the generic credential readiness check blocks the earlier API-key step and also makes the later webhook-secret replacement step unreachable. An operator can re-enter the Stripe keys but still cannot complete setup without using a browser-console workaround.

**Commercial fit and stack**
The platform repository describes an open-source booking, membership, payments and lodge-operations system, built with Next.js 16, React 19, PostgreSQL 16 and Prisma 7. Its homepage points to Tokoroa Alpine Club. The club's official site reports 414 members, is 100% volunteer-run, invoices annual subscriptions through Xero and uses Stripe for lodge bookings. See [club website](https://tokoroa.org.nz/), [membership details](https://tokoroa.org.nz/join), [terms](https://tokoroa.org.nz/terms), and [platform README](https://github.com/triyder/AlpineClubBookingsNZ/blob/main/README.md).

The issue is in the generic platform repository. It is not proof that the club's own production deployment has hit the deadlock.

**Likely decision-maker**
Treasurer for budget and payments, with the Bookings & Membership Officer for day-to-day system operations. Committee approval may be required.

**Opening angle**
A small credential-recovery sprint that tracks which individual credential is unreadable, keeps the webhook step reachable, and adds regression tests for authentication-secret rotation.

**Next check**
Establish whether the club's deployment is affected and whether the committee has a technology-maintenance budget. This is a not-for-profit, volunteer-run organisation, so don't assume commercial sprint pricing is viable.

## 10. OpenMeter by Kong
**Score: 6.6/10 | Enterprise/OSS lead, version caveat**

**Observed pain**
[Issue #5409](https://github.com/openmeterio/openmeter/issues/5409) describes a local invoice that was never synced to Stripe. Deleting it through the OpenMeter v1 API returns a 400 because the code attempts a Stripe deletion without a provider invoice ID, leaving the invoice in a failed-delete state.

**Commercial fit and API**
OpenMeter joined Kong in September 2025. The project remains open source, while the managed product is Konnect Metering & Billing. Kong publishes usage-based pricing for metering and billing, and OpenMeter exposes REST APIs and typed SDKs. See [Kong's acquisition announcement](https://konghq.com/company/press-room/press-release/kong-acquires-openmeter-to-unlock-ai-and-api-monetization-for-the-agentic-era), [OpenMeter API documentation](https://openmeter.io/docs/api), and [Kong pricing](https://www.konghq.com/pricing).

**Critical caveat**
Issue #5409 is on the v1/open-source API path. Kong's managed Konnect Metering & Billing customers must use API v3. Do not assume this issue affects the managed v3 service.

**Likely decision-maker**
Kong product engineering lead for Metering & Billing, or the OpenMeter OSS maintainer.

**Opening angle**
Only if the v1 path is still actively supported: make provider-sync state explicit, allow local-only invoice deletion idempotently, and test both local-only and Stripe-backed invoices. Keep v1 and v3 scope separate.

**Next check**
Confirm whether the affected v1 path remains a supported customer surface and whether the issue has an accepted fix. Otherwise, drop it.

## Exclusions and pipeline hygiene

- **MyTradingCoach:** issue #819 closed on 1 November. Removed from active prospects.
- **Mingla:** related fee-preview issue #1401 is closed; the larger payout work is substantially implemented. Do not pitch the already-completed payout work.
- **Auto Author:** the checkout configuration fix is already being implemented in PR #1235. Do not duplicate it.
- **Waaiio:** the payment/cancellation race is a constructed test scenario, not a confirmed provider incident, and the public site still emphasises launch updates.
- **Mirlo:** the project describes itself as volunteer-run and says additional payment-provider work is beyond current volunteer capacity. Not a near-term commercial lead.
- **Hardcount:** open source and explicitly has no paid edition. Not a direct vendor prospect.
- **Paperclip:** a serious PostgreSQL performance report exists, but it concerns one self-hosted deployment and the project does not show a paid hosted offer. Keep as an OSS ecosystem watchlist, not a qualified paying prospect.
- **WooCommerce Stripe Gateway and Paymenter:** useful upstream technical signals, but the projects are free/open-source and no direct external engineering budget was established.

## Top three and next actions

1. **Lago:** verify maintainer/PR status for #6974 and #6903, then scope a provider-outcome reliability sprint. Keep Flutterwave retry handling separate from Stripe ambiguous-charge recovery.
2. **Stigg:** confirm the API team has not already fixed #109. Build a minimal reproduction and offer preview/provision parity tests across REST, GraphQL and the TypeScript SDK.
3. **TutorCruncher:** check #448 and #456 against the current implementation. Because #448 already has an internal assignee, offer help only if the duplicate-data and reporting work remains unresolved or the team wants an independent acceptance pass.

Chronote is the best fourth option if a smaller founder-led buyer is preferred.

**Operating boundary:** No prospects contacted, no forms submitted, no money spent, no production systems accessed or changed. All opening angles are research drafts only.
