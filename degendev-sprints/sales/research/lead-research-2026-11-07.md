# DegenDev Lead Research - 7 November 2026

## Executive summary

This batch contains nine fresh prospects and one requalified account already in the DegenDev pipeline. The strongest commercial opportunities are WPSubscription, LifterLMS and Paid Memberships Pro. Bike4Mind and WCPOS are close behind.

Scores combine commercial evidence, specificity of the technical signal, fit with DegenDev's payment and integration work, API/testability evidence, and whether internal work appears to be underway. Scores are not predictions of closing probability. Test-mode and staging findings are labelled as such. Proposed improvements are not presented as production incidents.

## Ranked list

| Rank | Prospect | Score | Evidence class | Main opportunity |
|---:|---|---:|---|---|
| 1 | WPSubscription / Convers Lab | 9.5 | Customer-reported double charge, not yet reproduced on the maintainer bench | Early-renewal and retry state correctness |
| 2 | LifterLMS / Gocodebox | 9.4 | Customer report affecting 40+ active subscriptions | Preserve payment-method self-service after access-plan deletion |
| 3 | Paid Memberships Pro | 9.2 | Reproducible E2E checkout race, 3/4 runs in some test runs | Checkout confirmation and Stripe renewal correctness |
| 4 | Bike4Mind | 9.0 | Two staging test-mode billing UX failures, checkout issue reproduced 2/2 | Checkout return, purchase history and billing ledger consistency |
| 5 | WCPOS | 8.8 | Fresh Stripe test-mode guest checkout failure | Guest payment compatibility in the POS flow |
| 6 | Inkseq / H3 Studio | 8.5 | Production state mismatch: six expired unpaid sessions remain created | Stripe event reconciliation and alarm correctness |
| 7 | Forhu / iLoveLawyer | 8.2 | Paid-plan test payment does not preserve case-request eligibility | Subscription-to-entitlement synchronization |
| 8 | Town Crier | 8.0 | Commercial expansion request with a concrete cross-source entitlement risk | Stripe web billing and per-source subscription ledger |
| 9 | erxes | 7.3 | Explicit internal backlog item, not a confirmed outage | Durable invoice-callback retry contract |
| 10 | Verenigingen | 6.8 | Architecture gap; actual missed refund event not established | Mollie refund/chargeback reconciliation |

---

## 1. WPSubscription / Convers Lab

**Score: 9.5/10 | High priority**

**Observed signal:** Open issue [#355](https://github.com/converslabs/subscription/issues/355) records a customer report where an early renewal paid with Google Pay creates a second subscription instead of extending the original. The original subscription's scheduled retry then creates and charges another renewal order. The issue includes order IDs, timestamps, a $92.98 original order and a $29.99 early-renewal order.

The reporter has traced likely code paths through the free and Pro plugins, but explicitly says the scenario has not yet been reproduced on the maintainer's bench. Treat it as a serious customer report, not a fully verified root cause.

**Commercial evidence:** WPSubscription sells recurring billing software for WooCommerce. Its official site lists plans from $89/year, 1,000+ active stores and support for Stripe, PayPal, Paddle, Razorpay and Mollie. Its About page identifies Parvez Akther as founder/CEO and Abu Huraira as co-founder/technical lead.

**Stack/API evidence:** WordPress, WooCommerce, Stripe gateway and express checkout through Google Pay/Apple Pay/Link. The issue references the WooCommerce Store API checkout route and subscription lifecycle code.

**Likely decision-maker:** Abu Huraira, co-founder and technical lead, with Parvez Akther as commercial decision-maker.

**Opening angle:** Offer a narrowly scoped early-renewal correctness sprint: reproduce the customer path, prevent an early-renewal order from creating a second subscription, suppress the original subscription's retry while the early renewal is pending or paid, and add regression coverage for wallet checkout plus retry delivery.

**Qualification caveat:** The free-plugin repository has no directly matching open fix PR in the search performed. The issue references a companion Pro issue, but the Pro repository's state could not be independently verified in this run.

Sources:
- [Issue #355](https://github.com/converslabs/subscription/issues/355)
- [Official WPSubscription pricing](https://wpsubscription.co/pricing/)
- [About and leadership](https://wpsubscription.co/about/)

## 2. LifterLMS / Gocodebox

**Score: 9.4/10 | High priority**

**Observed signal:** Open issue [#3433](https://github.com/gocodebox/lifterlms/issues/3433) reports that students lose the Update Payment Method and Reactivate Subscription actions after an administrator permanently deletes the access plan attached to an existing recurring order.

The issue says a customer has 40+ affected active subscriptions. Recurring charges continue, but students whose cards expire cannot update their payment method themselves. The issue identifies a likely stale guard in the payment-source-switch template: it returns early when the original access plan no longer exists, even though the submit path now works from the order.

The issue is assigned to an internal maintainer. No directly matching open fix PR appeared in the targeted PR search.

**Commercial evidence:** LifterLMS sells annual bundles at $199, $299 and $799, alongside a free core plugin. Its official pricing page says more than 10,000 creators use the platform.

**Stack/API evidence:** WordPress/PHP, LifterLMS recurring orders, payment gateway source switching, and the LifterLMS REST API. The issue explicitly references the REST access-plans delete route.

**Likely decision-maker:** Engineering lead or product engineering manager at Gocodebox. The issue assignee is the likely technical owner; purchasing authority should be confirmed.

**Opening angle:** A subscription-continuity sprint covering deleted-plan regression tests, payment-source switching, pending-cancel reactivation and REST deletion edge cases. The acceptance test should prove that deleting an enrollment option never removes the self-service controls from an already active subscription.

**Qualification caveat:** The 40+ figure is from the customer report. The issue's environment checklist is not marked as reproduced on a clean staging or production install.

Sources:
- [Issue #3433](https://github.com/gocodebox/lifterlms/issues/3433)
- [Official LifterLMS pricing](https://lifterlms.com/pricing/)

## 3. Paid Memberships Pro

**Score: 9.2/10 | Requalified existing pipeline lead**

This is not a new company in the pipeline. The new issue materially strengthens the existing opportunity, so it remains a prospect rather than being counted as a fresh account.

**Observed signal:** Open issue [#3914](https://github.com/strangerstudios/paid-memberships-pro/issues/3914) reports a race between the Stripe Checkout webhook and the customer's confirmation-page request. The webhook activates the membership, but the in-flight confirmation request retains a cached pre-activation membership lookup and redirects the customer to the account page instead of showing the confirmation page.

The reporter says their Playwright + Stripe test-mode E2E runs hit the failure in 3 out of 4 purchases in some runs. The membership is active, but the thank-you page and conversion tracking are skipped.

The previously tracked issue [#3836](https://github.com/strangerstudios/paid-memberships-pro/issues/3836), about stale billing addresses on Stripe renewals, also remains open. No directly matching open fix PR for #3914 appeared in the targeted search.

**Commercial evidence:** PMPro says it has been profitable for 15 years and supports thousands of membership sites. Standard is listed at $49/month and Max at $99/month, with managed hosting and a Do It For Me development service on Max.

**Stack/API evidence:** WordPress/PHP, Stripe Checkout, Stripe webhooks, membership-level caching and Playwright E2E tests.

**Likely decision-maker:** Product/engineering lead or CTO at Stranger Studios. The existing proposal and lead notes are already in the DegenDev sales repository.

**Opening angle:** Update the existing Stripe Renewal Correctness proposal to include a separate checkout-confirmation race track. Keep the two acceptance suites distinct: billing-address persistence on renewal, and membership-cache consistency when webhook activation races with the confirmation request.

**Qualification caveat:** The E2E reproduction is in Stripe test mode. Do not describe it as a confirmed production conversion loss.

Sources:
- [Issue #3914](https://github.com/strangerstudios/paid-memberships-pro/issues/3914)
- [Issue #3836](https://github.com/strangerstudios/paid-memberships-pro/issues/3836)
- [Official pricing](https://www.paidmembershipspro.com/pricing/)
- [Hosting and Max plans](https://www.paidmembershipspro.com/hosting/)

## 4. Bike4Mind

**Score: 9.0/10 | Strong founder-led SaaS fit**

**Observed signal:** Two open issues were filed from staging QA on 6 November.

- [#6644](https://github.com/Bike4Mind/bike4mind/issues/6644): after a successful Stripe Checkout, the return flow calls the checkout-session API before the auth token is ready and receives 401. The subscription is actually applied, but the user sees no success confirmation. The issue reports this on 2 of 2 test-mode checkouts.
- [#6645](https://github.com/Bike4Mind/bike4mind/issues/6645): after a $30 Professional subscription, the billing screen still shows an empty credit-purchase history.

These are staging/test-mode UX and billing-history failures, not confirmed live charge failures.

**Commercial evidence:** Bike4Mind's official site describes the hosted service as bootstrapped and profitable. Professional is $30/month and Team is $100/month. Enterprise deployments are sold through the CEO.

**Stack/API evidence:** Next.js, TypeScript, Node API routes, MongoDB/Mongoose, Stripe Checkout and a public API. The open-core repository distinguishes the hosted billing/entitlements service from the self-hosted engine.

**Likely decision-maker:** Founder/CEO Erik Bethke or the billing/API engineering owner.

**Opening angle:** A post-Checkout reliability sprint: wait for authenticated session readiness, retrieve the checkout result safely, show an authoritative success state, and reconcile subscription charges and monthly credit grants into a user-visible payment history.

**Qualification caveat:** PR #6525 adds live Stripe invoice/payment-method details to the admin subscription page, but it does not appear to resolve the two reported customer-facing issues.

Sources:
- [Issue #6644](https://github.com/Bike4Mind/bike4mind/issues/6644)
- [Issue #6645](https://github.com/Bike4Mind/bike4mind/issues/6645)
- [Official pricing](https://bike4mind.com/pricing)
- [Official product site](https://bike4mind.com/)
- [Repository](https://github.com/Bike4Mind/bike4mind)

## 5. WCPOS

**Score: 8.8/10 | Good commercial and API fit**

**Observed signal:** Fresh open issue [#2582](https://github.com/wcpos/woocommerce-pos/issues/2582), opened on 7 November, reports that a guest sale cannot be paid by card through the POS pay page using the WooCommerce Stripe gateway. Stripe rejects the payment because the guest order has no billing email. Attaching a customer with an email makes the same payment succeed.

The reproduction used Stripe gateway 11.1.1 in test mode. The issue was discovered after the Stripe card form began rendering on that pay page.

**Commercial evidence:** WCPOS reports 5,000+ active stores. WCPOS Pro is listed at $129/year or $399 lifetime and includes payment-terminal integration, custom gateways, order management and priority support.

**Stack/API evidence:** WordPress/PHP, WooCommerce, Stripe gateway and a dedicated WCPOS REST API. The repository describes the plugin as the server-side API/authentication layer for the POS clients.

**Likely decision-maker:** WCPOS founder/product owner or the engineer responsible for checkout and payment-gateway compatibility.

**Opening angle:** Build a guest-payment compatibility sprint: determine gateway-required billing fields before payment processing, make guest email handling consistent between the legacy pay page and the newer tender flow, and add gateway contract tests for Stripe plus other gateways that require customer identity.

**Qualification caveat:** The reported reproduction is in test mode. No live-store failure was established in the issue.

Sources:
- [Issue #2582](https://github.com/wcpos/woocommerce-pos/issues/2582)
- [Official WCPOS site](https://wcpos.com/)
- [WCPOS Pro](https://wcpos.com/pro)
- [WCPOS product and API overview](https://docs.wcpos.com/getting-started/is-wcpos-right-for-you)
- [Repository](https://github.com/wcpos/woocommerce-pos)

## 6. Inkseq / H3 Studio

**Score: 8.5/10 | Strong technical fit, budget needs qualification**

**Observed signal:** Open production issue [#1064](https://github.com/inkseq/h3-studio/issues/1064) reports six live Stripe checkouts whose sessions have expired but whose local payment rows remain created. Each keeps raising a payment-processing-stalled alarm.

The issue reports eight checkout-session-expired events but only two corresponding payment rows moved to expired. Nothing was paid on the six stale records. The exact handler failure has not yet been traced, so the cause remains open.

**Commercial evidence:** The repository describes Inkseq as a business API for Quick Chat, story creation and external agents. The service has a production Stripe checkout path, but I could not verify public pricing in this run.

**Stack/API evidence:** Python platform backend, Stripe event handling, persistent payment/event records and a public business API, as described in the repository README.

**Likely decision-maker:** Founder/technical owner of Inkseq.

**Opening angle:** A Stripe event-reconciliation sprint that traces event receipt, signature verification, event-to-payment mapping and allowed state transitions. Add replay-safe handling and prove that expired unpaid sessions clear their alarm while genuine processing payments continue to alert.

**Qualification caveat:** Public pricing and the size of the paid customer base weren't verified. This is a technically strong lead but should not outrank the established subscription businesses until budget is clearer.

Sources:
- [Issue #1064](https://github.com/inkseq/h3-studio/issues/1064)
- [Repository README](https://github.com/inkseq/h3-studio/blob/main/README.md)
- [Inkseq official site](https://inkseq.com/)

## 7. Forhu / iLoveLawyer

**Score: 8.2/10 | Strong subscription-to-access fit**

**Observed signal:** Open issue [#971](https://github.com/FORHU/ilovelawyer-app/issues/971), opened 6 November, reports that lawyers who successfully subscribe to a paid plan through Stripe test mode stop receiving client case requests. Free-tier lawyers can receive requests. The issue explicitly identifies the need to synchronize Stripe subscription state, plan entitlements and case-assignment permissions.

The issue is assigned internally. It is a test-mode reproduction, not a confirmed live customer incident.

**Commercial evidence:** A launch announcement dated 8 October describes iLoveLawyer as a legal-intelligence platform with Solo, Professional and Enterprise plans. The announcement identifies Forhu Inc. and CEO Jungkwan Shin. Numeric pricing wasn't verified.

**Stack/API evidence:** The public app repository is a Next.js monorepo template. The issue confirms Stripe test-mode checkout and a frontend/backend entitlement path, but the complete production backend stack wasn't independently verified.

**Likely decision-maker:** CEO/product owner or CTO/Head of Engineering at Forhu Inc.

**Opening angle:** A payment-to-permission sprint: define the canonical subscription state, make verified Stripe events update the lawyer's entitlement record, and prove that paid lawyers remain eligible for case assignment across activation, renewal, past_due and cancellation.

**Qualification caveat:** Confirm that the test-mode failure hasn't already been fixed before preparing a proposal.

Sources:
- [Issue #971](https://github.com/FORHU/ilovelawyer-app/issues/971)
- [Launch announcement](https://story.thelondonjournal.co.uk/press-release/2026-10-08/37373/forhu-launches-ilovelawyer-an-ai-legal-intelligence-platform-built-for-lawyers)
- [Forhu official site](https://forhu.ai)

## 8. Town Crier

**Score: 8.0/10 | Commercial expansion opportunity**

**Observed signal:** Open issue [#1332](https://github.com/AmyDe/town-crier/issues/1332) proposes web payments through Stripe and a per-source subscription ledger in PostgreSQL. Today all revenue comes through Apple In-App Purchase. The existing profile has one subscription slot, so a late Apple refund could overwrite access still paid for by a Stripe subscription or offer-code grant.

This is a planned expansion and an identified architecture risk, not an existing Stripe production outage.

**Commercial evidence:** Town Crier is a UK planning-application monitoring product. Its public pricing lists Personal at £1.99/month and Pro at £4.99/month, with annual and lifetime Pro options in the iOS app. An earlier public issue records that the product already had paying customers.

**Stack/API evidence:** Go API, PostgreSQL/PostGIS, React/TypeScript web app, Swift iOS app, Azure Container Apps, Auth0 and StoreKit 2. The issue proposes Stripe Checkout and Customer Portal for web users.

**Likely decision-maker:** Founder/product owner and technical maintainer. The GitHub issue author appears to own the implementation work, but a formal title wasn't verified.

**Opening angle:** A subscription-source ledger sprint with one row per grant/source, deterministic effective-tier calculation, source-scoped webhook processing, late-event tests, audit history and a staged migration that preserves the existing StoreKit path.

**Qualification caveat:** Consumer pricing is low, so the strongest commercial angle is the newly opened professional, Android and business-invoice segment rather than the existing individual plan alone.

Sources:
- [Issue #1332](https://github.com/AmyDe/town-crier/issues/1332)
- [Official product and pricing](https://towncrierapp.uk/)
- [Product overview and technical architecture](https://github.com/AmyDe/town-crier/blob/main/docs/product-overview.md)
- [Earlier paying-customer evidence](https://github.com/AmyDe/town-crier/issues/794)

## 9. erxes

**Score: 7.3/10 | Commercial fit, weak pain evidence**

**Observed signal:** Open issue [#10383](https://github.com/erxes/erxes/issues/10383) is an internal Operation-plugin task asking for invoice callbacks to be sent through a retrying queue.

The public issue contains only the task title and an automatically generated link. It does not document a failed callback, retry policy, customer impact or acceptance criteria. This is an explicit engineering backlog item, not a confirmed production failure.

**Commercial evidence:** erxes reports more than 25,000 organizations. Its Sales plans are listed at $49 and $99/month, and its Payment plugin is listed from $99/month in the marketplace.

**Stack/API evidence:** Open-source/self-hosted XOS, plugin architecture, GraphQL federation and API/MCP access. The exact invoice callback implementation stack isn't established by the issue.

**Likely decision-maker:** Payment plugin product lead or engineering manager.

**Opening angle:** Offer a short discovery and implementation sprint only after clarifying the callback contract: durable queue, bounded retry/backoff, idempotency key, dead-letter/replay path, delivery observability and reconciliation.

**Qualification caveat:** Do not pitch this as an outage or payment loss. The public issue is too thin to establish either.

Sources:
- [Issue #10383](https://github.com/erxes/erxes/issues/10383)
- [Official erxes site](https://erxes.io/)
- [Sales pricing](https://erxes.io/plugins/sales)
- [Product marketplace](https://erxes.io/products)

## 10. Verenigingen

**Score: 6.8/10 | Conditional membership-platform lead**

**Observed signal:** Open issue [#2140](https://github.com/nlvegan/verenigingen/issues/2140) identifies a refund/chargeback reconciliation gap in the Mollie integration. Refund and chargeback discovery currently runs only when a payment webhook is delivered. There is no scheduled job to rediscover refunds from Mollie. If the webhook delivery chain is lost beyond the provider's retry window, the refund may never be booked.

The issue explicitly says that actual lost delivery frequency has not been measured. Treat this as an architecture risk, not a confirmed missed refund.

**Commercial/product evidence:** Verenigingen is an association-management system for Dutch non-profits, with member renewals, SEPA dues, invoicing, bank reconciliation, Mollie payments for memberships and donations, and eBoekhouden integration. The README says implementation and customization support are available. No public price was found.

**Stack/API evidence:** ERPNext v15+ / Frappe application, Python, Mollie API/webhooks and accounting integration.

**Likely decision-maker:** Project maintainer or technical lead responsible for payments and finance modules. A commercial entity and purchasing budget weren't verified.

**Opening angle:** A bounded Mollie reconciliation sprint: scheduled refund/chargeback discovery using authoritative provider data, existing reversal idempotency keys, audit records and failure-injection tests for missed webhook delivery.

**Qualification caveat:** Budget and commercial buyer are unverified. Keep below the SaaS/plugin leads until an implementation or support budget is evident.

Sources:
- [Issue #2140](https://github.com/nlvegan/verenigingen/issues/2140)
- [Verenigingen repository and product overview](https://github.com/nlvegan/verenigingen)

---

## Pipeline hygiene and exclusions

- **SameDay / Jack Fix It #297:** the abandoned PaymentIntent/quote-lock problem is real in the code, but an internal builder has already been assigned the two-hour cancellation job. Monitor after the internal work lands; don't pitch the original fix now.
- **SVC #636:** an autopay feature is already being implemented in open PR #640. Don't offer to build the same feature.
- **Mingla #3645:** active internal payout-engine work is in review. Its payout and rail-isolation work is not an untouched opportunity.
- **Reg Race Result:** the first organizer's launch checklist still has Stripe Connect, webhook and live test-purchase steps unchecked. This is a pre-launch implementation opportunity, but the first organizer pays no platform fee and the future pricing model isn't set, so budget fit is weak.
- **Hardcount:** explicitly open source with no paid edition. It is not a buyer for a paid sprint on the evidence reviewed.

## Top three and next practical action

| Priority | Prospect | Next practical action |
|---:|---|---|
| 1 | WPSubscription | Confirm the Pro companion issue's state and ask for a clean reproduction before scoping. Prepare a fixed-scope early-renewal/retry correctness sprint. |
| 2 | LifterLMS | Check whether the assigned maintainer has started a fix. If not, propose the deleted-access-plan subscription-continuity regression sprint. |
| 3 | Paid Memberships Pro | Update the existing proposal with issue #3914 as a separate checkout-confirmation race workstream, keeping it distinct from #3836's stale renewal address problem. |

The best fresh reserve lead is Bike4Mind. Its commercial fit is strong, the two staging billing defects are well specified, and the owner publicly describes the business as bootstrapped and profitable.

No prospects have been contacted, no forms have been submitted, no money has been spent, and no production systems have been accessed or changed.
