# DegenDev Sprint Lead Research
## 31 October 2026

Research baseline: public GitHub issues/PRs, repository metadata, and official product pages checked on 31 October 2026. Qualification scores reflect commercial fit, pain evidence, API/stack fit, recency, and likely buyer access. They are not close probabilities.

No prospects were contacted. No forms were submitted. No money was spent.

## Executive ranking

| Rank | Prospect | Score | Signal | Commercial qualification |
|---:|---|---:|---|---|
| 1 | Paid Memberships Pro | 8.5/10 | Existing Stripe renewal data inconsistency | Strong paid product; internal development service is a competing route |
| 2 | Lago | 8.4/10 | Fresh Flutterwave webhook verification failure | Strong paid cloud/API product; larger engineering organisation |
| 3 | Waaiio | 7.7/10 | Late provider payment after booking cancellation | Public paid plans; pre-launch and no confirmed production incident |
| 4 | Horizon / Shoreward | 7.4/10 | Stripe-derived account status and Google sign-in access | B2B product with discovery-call sales path; pricing not public |
| 5 | Auto Author | 7.3/10 | Stripe Managed Payments checkout compatibility | Paid subscription flow; owner already has an open implementation PR |
| 6 | BonaMind | 7.2/10 | Subscription plan authority differs across clients/screens | Subscription product; active fix PR and unresolved Android billing decision |
| 7 | DanceFlow App | 7.0/10 | Multiple live subscriptions and webhook ordering | Active product repo; public price/buyer budget not independently verified |
| 8 | Preppie | 6.3/10 | Paid-beta Stripe subscription lifecycle not yet represented authoritatively | Paid plan documented, but issue and repo activity are stale |
| 9 | Paymenter | 6.1/10 | Delayed SEPA settlement can leave a paid service active but unprovisioned | Useful hosting-billing product/API; open-source, no vendor budget evidence |
| 10 | Ticketeer | 5.8/10 | Stripe webhook lifecycle and stuck checkout states | Owner-operated ticketing build; no public pricing or customer traction verified |

---

## 1. Paid Memberships Pro — 8.5/10

**Observed signal:** Issue [#3836](https://github.com/strangerstudios/paid-memberships-pro/issues/3836) remains open. A member can update their billing address and see the new address in Stripe, but later PMPro renewal orders retain the old address. The issue identifies two code-level causes: the renewal handler prefers stale PaymentMethod.billing_details.address, and the billing page update path doesn't persist the existing PMPro order row.

**Commercial evidence:** PMPro's official site lists Standard at $49/month and Max at $99/month, and says the business has operated profitably for 15 years. It sells paid support and managed hosting to membership businesses. Sources: [official pricing](https://www.paidmembershipspro.com/pricing/), [official product page](https://www.paidmembershipspro.com/).

**Stack evidenced:** WordPress/PHP plugin, Stripe gateway and webhook handler.

**Likely buyer:** Product/engineering lead or technical co-founder responsible for the Stripe gateway and renewal lifecycle. The issue reporter is not assumed to be the buyer.

**Tailored opening angle:** Offer a tightly bounded update-to-renewal correctness sprint: reproduce the billing-page change, align PaymentMethod/Customer/order sources, persist the order row, and add a regression test that proves the next renewal uses the new address.

**Qualification caveat:** PMPro's official documentation says it isn't currently taking on new gateway development and already offers Do It For Me development through Max. Don't pitch a new gateway or generic development capacity. Position this only as a focused repair to the existing Stripe integration, and confirm whether the issue is still reproducible before any proposal.

**Next check:** Confirm no fix has landed since the issue's 28 September update, then identify the engineering owner for existing Stripe gateway maintenance.

## 2. Lago — 8.4/10

**Observed signal:** New issue [#6974](https://github.com/getlago/lago-api/issues/6974), created 31 October, describes a Flutterwave charge.completed webhook that receives HTTP 200, but a transient verification API failure (429/5xx/timeout) is converted to nil. The job then finishes successfully, no retry occurs, no payment is recorded, and the invoice remains pending. The issue includes a deterministic reproduction using a 503 followed by a successful verification response.

**Related work:** Open PR [#5729](https://github.com/getlago/lago-api/pull/5729) handles a different but related Flutterwave issue: resolving the invoice from the verified tx_ref when webhook metadata is missing or incorrect. It does not, based on its description, solve transient verification-call retry semantics. Keep these as separate failure modes.

**Commercial evidence:** Lago sells a hosted billing product with custom-quoted premium pricing and a free AGPL self-hosted edition. Its product supports REST APIs, SDKs and signed webhooks. Sources: [official Lago site](https://getlago.com/), [Lago repository](https://github.com/getlago/lago).

**Stack evidenced:** Ruby/Rails application, asynchronous jobs, Flutterwave and Stripe provider integrations. The repository is Ruby; the issue references job retry semantics and service-layer code.

**Likely buyer:** Head of Engineering, payments integrations lead, or engineering manager responsible for payment-provider reliability. This is not a founder-led micro-SaaS lead.

**Tailored opening angle:** A bounded Flutterwave reliability sprint: preserve transient verification errors, retry with bounded backoff, keep permanent validation failures distinct, and add tests proving that a 503 followed by a successful verification ultimately records the payment exactly once.

**Qualification caveat:** The issue was filed by an external reporter, not necessarily by Lago staff. Verify maintainer acknowledgement and whether an internal fix is already underway before treating it as an active buying signal.

**Next check:** Compare #6974 with the existing Flutterwave PR #5729 and the provider job retry policy. Do not combine the two defects into one vague webhook rewrite.

## 3. Waaiio — 7.7/10

**Observed signal:** Issue [#735](https://github.com/cipherhq/waaiio/issues/735) describes a constructed race: a customer cancels a pending booking, then the payment provider reports success. The booking remains cancelled while the payment becomes successful. The issue explicitly says no real provider incident has been established. A read-only staging check on 28 October found zero matching successful-payment/cancelled-booking rows; production was not checked.

**Commercial evidence:** Waaiio's official site publishes Starter, Pro and Premium tiers. Pro is listed at ₦20,000/month and Premium at ₦60,000/month. It advertises bookings, orders, ticketing, recurring payments, Stripe and Paystack. The site currently asks visitors to join launch updates, so pricing is public but live commercial traction isn't established. Source: [official Waaiio site and pricing](https://www.waaiio.com/).

**Stack evidenced:** TypeScript, Supabase/PostgreSQL, Stripe, Paystack and WhatsApp Business Platform integrations.

**Likely buyer:** Founder/product owner or technical lead. Formal title and budget authority aren't independently verified.

**Tailored opening angle:** A payment-state reconciliation sprint that traces the existing canonical payment, refund and booking-finalization paths, proves both event orderings, and implements only the owner-approved outcome. Don't introduce a second refund workflow or decide product policy on the owner's behalf.

**Qualification caveat:** This is a code-level launch-safety gap, not a confirmed production loss. The issue itself requires an owner decision on refund/rebooking policy before implementation.

**Next check:** Verify the current owner decision, confirm whether the same interleaving remains reproducible on current main, and establish whether the launch has moved beyond the public waitlist.

## 4. Horizon / Shoreward — 7.4/10

**Observed signal:** Issue [#635](https://github.com/FinTekkers/horizon/issues/635) remains open. It specifies that Google sign-in should admit active or cancelling paid accounts, refuse pending-payment/past-due/cancelled accounts, and revoke stale sessions without requiring a server restart. The access state is sourced from the Stripe webhook work in the same project. The issue depends on project-isolation work and tests.

**Commercial evidence:** Shoreward's official site presents Horizon as a B2B AI work-farm product and offers a discovery call rather than public self-serve pricing. Sources: [Shoreward/Horizon](https://shoreward.ai/), [solution overview](https://shoreward.ai/solution.html).

**Stack evidenced:** JavaScript/Node.js, React/Vite, SQLite, Google OAuth and Stripe-derived subscription status in the public repository.

**Likely buyer:** Founder/CTO or product engineering lead responsible for account access and subscription lifecycle.

**Tailored opening angle:** Offer an entitlement-boundary sprint covering Stripe-derived status, Google sign-in, session revocation and project isolation. Acceptance should prove that a customer who moves from active to past_due or cancelled loses access on the next request, without a server restart.

**Qualification caveat:** The issue describes desired behaviour and tests; it isn't proof that a paying customer has been locked out. Pricing and procurement process aren't public.

**Next check:** Confirm dependency #664 and the Stripe webhook implementation have landed, then check whether #635 remains an actual release blocker.

## 5. Auto Author — 7.3/10

**Observed signal:** Issue [#1234](https://github.com/frankbria/auto-author/issues/1234) records a staging checkout failure caused by Stripe Managed Payments being enabled as the account default while the application sent incompatible Checkout parameters. The owner chose to adopt Managed Payments rather than disable it.

**Current implementation status:** PR [#1235](https://github.com/frankbria/auto-author/pull/1235) is open. It introduces an explicit STRIPE_MANAGED_PAYMENTS setting and selects compatible Checkout parameters. This is already being worked on, so don't pitch the same implementation as if nobody has started it.

**Commercial evidence:** The repository describes a paid book-authoring product with Free/Pro plans and Stripe Checkout. The owner has a support address at autoauthor.app in the public issue discussion.

**Stack evidenced:** TypeScript frontend, Python backend, Stripe SDK 16.0.0, FastAPI-style endpoint structure.

**Likely buyer:** Founder/product owner and technical maintainer.

**Tailored opening angle:** After PR #1235 lands, offer independent billing acceptance verification: test both Managed Payments modes, test/live configuration separation, Checkout, portal, subscription renewal/cancellation and webhook-derived access.

**Qualification caveat:** The primary bug already has an open implementation PR. Don't approach with a duplicate fix. The opportunity is independent acceptance and regression coverage only if the owner wants outside help.

**Next check:** Recheck PR #1235 and confirm whether the owner has completed a successful staging purchase with the chosen Managed Payments configuration.

## 6. BonaMind — 7.2/10

**Observed signal:** Open PR [#190](https://github.com/shipking-ai/BonaMind/pull/190) documents inconsistent plan display across Windows, iPhone and Android. Some screens read user-writable user_metadata.plan, while other screens read a separate profile row. The PR moves display resolution to server-controlled app_metadata.subscription_status. The PR remains open. Issue [#226](https://github.com/shipking-ai/BonaMind/issues/226) also leaves an Android subscription decision open: Stripe Checkout versus Google Play Billing or removing in-app purchase.

**Commercial evidence:** The repository describes a web/PWA/native Android learning product with subscription tiers and paid access. Official repository metadata lists bonamind.app as its homepage.

**Stack evidenced:** TypeScript, React/PWA, Capacitor Android, Supabase and Stripe.

**Likely buyer:** Founder/technical owner or product lead responsible for mobile billing and entitlement consistency.

**Tailored opening angle:** Once the Android billing route is decided, offer a cross-client entitlement sprint: one server-owned subscription state, verified provider events, consistent plan resolution across web and mobile, and tests proving client-editable metadata cannot grant Pro access.

**Qualification caveat:** PR #190 already addresses part of the problem, and issue #226 is still a product-policy decision. Don't sell a fix that's already in flight.

**Next check:** Recheck PR #190, determine which value the Stripe webhook and dunning process now treat as authoritative, and wait for the Android billing decision.

## 7. DanceFlow App — 7.0/10

**Observed signal:** Issue [#354](https://github.com/genxttech/danceflow-app/issues/354) documents residual Stripe subscription webhook findings. PR [#360](https://github.com/genxttech/danceflow-app/pull/360) has merged and addresses the cross-event write race with a read watermark and transactional RPC, but the migration is explicitly unapplied and the change is dark until release. Issue #354 still records a separate case where two simultaneously live subscriptions for one studio can overwrite each other and temporarily remove paid entitlement. The production release plan [#353](https://github.com/genxttech/danceflow-app/pull/353) remains a draft plan, not authorization to deploy.

**Commercial evidence:** The repository is an actively maintained DanceFlow application. Public pricing or an independently verified production sales page for this exact repository was not established in this run.

**Stack evidenced:** TypeScript, Stripe subscription webhooks, PostgreSQL/Supabase database paths and transactional RPC/migrations.

**Likely buyer:** Repository owner/product engineering lead. Formal title and purchasing budget aren't independently verified.

**Tailored opening angle:** A narrow subscription-conflict sprint for the remaining multiple-live-subscription case, plus release acceptance for the already-merged watermark/RPC work. Preserve the owner's migration and production approval gates.

**Qualification caveat:** The owner is already doing substantial implementation and QA work. This is an active technical signal, but external purchasing intent is not proven.

**Next check:** Re-read #354 after PR #360, isolate the still-open R-A conflict, and confirm whether the product has an external paying customer base before outreach.

## 8. Preppie — 6.3/10

**Observed signal:** Issue [#118](https://github.com/AxiomaSystems/Chef/issues/118) remains open and describes a paid-beta billing gap: no authoritative subscription record, no webhook lifecycle, and no safe mapping between a Preppie user and a Stripe customer. It specifies Checkout/Customer Portal, signed idempotent webhooks, lifecycle state handling and reconciliation.

**Commercial evidence:** The repository business-model documentation describes a freemium product with a Premium plan. That document lists $7.99/month or $59.99/year, while the original issue #118 describes an earlier founding-plan target of $6.99/month. Treat pricing as unconfirmed until the owner updates it. Source: [Preppie repository](https://github.com/AxiomaSystems/Chef).

**Stack evidenced:** Next.js/TypeScript, NestJS, Prisma, PostgreSQL and Stripe.

**Likely buyer:** Founder/product owner or technical lead.

**Tailored opening angle:** A small paid-beta billing foundation: Stripe customer mapping, one normalized local subscription record, signed/idempotent webhook ingestion, explicit access policy and test-mode reconciliation. Keep annual billing out until the owner confirms the commercial policy.

**Qualification caveat:** The issue was last updated 17 July and the repository's latest push was in August. This is a freshness warning, not evidence the problem is still active.

**Next check:** Verify the current product status and whether billing has been implemented elsewhere before preparing a quote.

## 9. Paymenter — 6.1/10

**Observed signal:** Issue [#1378](https://github.com/Paymenter/Paymenter/issues/1378) remains open. A Stripe SEPA Direct Debit payment can settle after the default seven-day order-cancellation job has already cancelled a pending service. The payment listener marks the invoice paid and the service active, but the provisioning path only creates pending services or unsuspends suspended services. The customer can therefore have paid for a service that appears active but was never provisioned.

**Commercial/product evidence:** Paymenter is an open-source billing panel for hosting companies, with subscription automation, service provisioning and a REST API. Sources: [official site](https://paymenter.org/), [repository](https://github.com/Paymenter/Paymenter).

**Stack evidenced:** PHP application, Stripe gateway, invoice/service lifecycle and cron-based provisioning.

**Likely buyer:** Project maintainer or engineering lead. The affected hosting operator may be a separate buyer; no direct paid vendor budget was found.

**Tailored opening angle:** A delayed-settlement recovery sprint: protect in-flight SEPA transactions from premature cancellation, reconcile the eventual payment, and ensure paid service state cannot diverge from provisioning state.

**Qualification caveat:** Paymenter is free and open source. This is better treated as a maintainer relationship or a route to hosting operators using the platform, not a confirmed direct software buyer.

**Next check:** Look for maintainer acknowledgement or a linked fix, then decide whether the better buyer is the Paymenter project or a hosting provider running it.

## 10. Ticketeer — 5.8/10

**Observed signal:** Owner-authored issue [#99](https://github.com/NaimElijah/Ticketeer/issues/99) defines signed, idempotent Stripe webhooks, processed-event persistence, refund/dispute handling and a reconciliation sweep. Issue [#214](https://github.com/NaimElijah/Ticketeer/issues/214), updated 30 October, documents orders stuck in CHECKOUT_IN_PROGRESS after a process crash, leaving seats reserved. New issue [#236](https://github.com/NaimElijah/Ticketeer/issues/236), opened 31 October, asks for explicit checkout decisions around declined cards, zero-total orders and checking event availability before charging.

**Commercial evidence:** The repository describes an event ticketing system and is actively updated by its owner. Public pricing, live customers and a commercial launch weren't verified.

**Stack evidenced:** Java application, Stripe integration, checkout/order persistence and a scheduled sweeper.

**Likely buyer:** Founder/technical owner.

**Tailored opening angle:** A checkout-integrity sprint covering bounded checkout locks, payment/webhook reconciliation and tests for charge/availability ordering. Keep business policy decisions with the owner; don't choose refund or inventory rules on their behalf.

**Qualification caveat:** This looks like an actively built product, but not yet a verified paying SaaS. Budget and commercial traction are unknown.

**Next check:** Confirm whether hosted Stripe Checkout is the selected architecture and whether #99 has become a release dependency before proposing work.

---

## Top three and next practical actions

### 1. Paid Memberships Pro
Reconfirm the exact billing-address defect against the current development branch and establish whether the maintainers want an external, fixed-scope repair. The official Do It For Me service is a competing internal option, so qualify that before preparing a quote.

### 2. Lago
Check whether maintainers have acknowledged #6974 and compare it with PR #5729. If no fix is underway for transient verification failures, offer a separate Flutterwave retry/idempotency sprint, not a duplicate invoice-lookup fix.

### 3. Waaiio
Confirm the owner-approved outcome for provider-paid-after-cancellation and whether launch is imminent. If the issue is still a launch gate, offer a narrowly scoped payment/booking reconciliation sprint with deterministic tests and no live payment or refund activity.

## Pipeline guardrails

- Do not pitch Auto Author's checkout fix while PR #1235 is open.
- Do not pitch DanceFlow's cross-event race as untouched; PR #360 has merged, although it remains unreleased and other residuals remain.
- Treat Waaiio's race as a code-level launch risk, not a confirmed production incident.
- Treat Preppie and other stale issue histories as requalification tasks, not immediate proposals.
- Treat Paymenter and Ticketeer as conditional leads until buyer budget and commercial status are established.
- No outreach, forms, spending, or production changes are authorized by this research.
