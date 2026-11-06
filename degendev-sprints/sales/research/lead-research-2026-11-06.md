# DegenDev Sprint Lead Research
## 6 November 2026

Research scope: founder-led SaaS, digital products and membership businesses with public evidence of payment webhook, subscription-to-access, PostgreSQL observability/performance or integration-reliability work. Public GitHub issues and official product/pricing pages were checked. Scores are commercial-fit assessments, not close probabilities.

### Qualification method

Scores weigh: commercial maturity and budget signals (30%), strength and recency of the pain evidence (30%), supported API/stack fit for DegenDev (20%), and likely buyer accessibility plus fixed-scope suitability (20%).

No prospect was contacted. No form was submitted, no money was spent, and no production account or system was accessed.

## Ranked pipeline

| Rank | Prospect | Score | Pipeline state | Main opportunity |
|---:|---|---:|---|---|
| 1 | Backenly | 9.5 | Active | Stripe connection state and webhook setup correctness |
| 2 | HeyForm | 9.3 | Active, scope boundary to confirm | Stripe public-form payment and webhook flow |
| 3 | Postiz | 9.1 | Active | OAuth token lifecycle, channel health and webhook contract |
| 4 | Stigg | 8.8 | Active | Subscription preview/provision parity |
| 5 | Cloudroom | 8.6 | Active, pricing availability needs confirmation | Windows ACP provider authentication |
| 6 | Elmo | 8.2 | Active, stale issue needs priority check | PostgreSQL query observability in Cloud builds |
| 7 | ReachKit (reachkit.app) | 7.9 | Early launch, no completed live payment recorded in latest go-live check | Safe post-Checkout return and account recovery |
| 8 | Fivvi | 7.5 | Early product, pilot blocked | Mollie Connect payment foundation |
| 9 | Lago | 7.3 | Monitor, fixes in review | Independent payment retry and duplicate-charge regression |
| 10 | TutorCruncher | 6.8 | Monitor, internally assigned | Pipedrive organisation matching and reporting integrity |

---

## 1. Backenly
**Score: 9.5/10**

**Observed pain:** Open issue #611, last updated 4 November. The console reports Stripe as connected when only the secret API key is configured, but the webhook receiver rejects every event with HTTP 401 until the signing secret is stored. The console also hides the webhook receiver URL, and the secret cannot be added independently through the current connection flow. The result is that order and subscription handlers do not run for developers who follow the UI as written.

**Evidence and stack:** The issue identifies the Next.js integration panel and webhook route. Backenly's product is built around PostgreSQL, REST endpoints, functions, event triggers and outbound webhooks.

**Commercial fit:** The official pricing page lists Pro at $25/month after the launch promotion and an Enterprise tier with custom annual agreement, onboarding/migration help and a 12-hour SLA. Pro includes event triggers and outbound webhooks. This is a paid developer platform with an explicit higher-value contract path.

**Likely decision-maker:** Founder or technical product lead, with the backend/integrations owner as the implementation stakeholder. A formal named buyer was not established from the public issue.

**Tailored opening angle:** Make the Stripe connection state represent the full integration contract, not just the API key. Show the webhook URL, show whether the signing secret is present, let the secret be configured independently, and add a setup smoke test that proves a signed event reaches the order/subscription handler.

**Next practical action:** Check for a newly opened fix branch or PR, then prepare a narrowly scoped Stripe integration-readiness sprint. This is the cleanest technical scope in the batch.

Sources:
- https://github.com/backenly/backenly/issues/611
- https://backenly.com/
- https://backenly.com/pricing

## 2. HeyForm
**Score: 9.3/10**

**Observed pain:** Open issue #386, updated 5 November. Public forms with Stripe connected do not render the payment field. Required payment questions cannot be submitted; optional payment questions can save an unpaid answer while creating a PaymentIntent that is never confirmed. The report also identifies a webhook raw-body route regression in v3.0.5 and use of the removed Stripe Charges field. A maintainer tested the full flow with Stripe sandbox keys on the current branch and confirmed that the public form still fails to display the payment question.

The reporter says they have a working prototype, but no payment fix PR appeared in the targeted open-PR search. The issue explicitly asks whether payment support is intended in the community edition and whether hosted forms load differently. That scope distinction must be resolved before quoting.

**Evidence and stack:** TypeScript, React, NestJS, MongoDB/Mongoose, Stripe Connect, raw-body webhook handling and a public form renderer.

**Commercial fit:** HeyForm describes itself as a bootstrapped two-person SaaS. Its official site reports 34k+ users and 100k+ deployments. Public plans range from $15 to $40/month, with custom Enterprise pricing. Payment acceptance is listed as a product feature, and the Business tier lists zero commission on payments.

**Likely decision-maker:** Product cofounder Luo Baishun and engineering cofounder Wu Qin. The official launch story identifies Luo as product owner and Wu as the engineering partner.

**Tailored opening angle:** Treat this as one end-to-end payment journey, not a renderer-only patch: Stripe Connect setup, public-form data contract, script loading, PaymentIntent confirmation, raw-body signature verification and the current Stripe API shape. Prove required and optional payment flows in sandbox, then confirm whether the same path is supported in hosted Cloud.

**Next practical action:** Establish the intended community-versus-hosted support boundary, then offer a fixed-scope public-form payment correctness sprint. Do not promise a hosted fix until the hosted architecture has been checked.

Sources:
- https://github.com/heyform/heyform/issues/386
- https://github.com/heyform/heyform
- https://heyform.net/
- https://heyform.net/pricing
- https://heyform.net/about-us
- https://heyform.net/blog/introducing-heyform-a-new-simple-form-app/

## 3. Postiz
**Score: 9.1/10**

**Observed pain:** Three open issues remain relevant:
- #2299 reports Facebook/Instagram Page-token channels being marked as needing refresh after 59 days, even when the Page token remains valid. Some Instagram status/permalink calls also use the expiring user token.
- #2373 requests that the public integrations API expose existing channel-health fields such as refreshNeeded, inBetweenSteps and tokenExpiration.
- #2374 requests optional per-webhook secrets with HMAC-SHA256 signatures and timestamp headers.

Important status distinction: PR #2380 is open and addresses concurrent token-refresh races. It does not, based on its current description, fix the 59-day Page-token lifecycle semantics in #2299. The two newer issues are feature requests, not evidence of a confirmed security incident.

**Evidence and stack:** TypeScript, NestJS, Prisma, PostgreSQL, OAuth provider integrations, public REST API and outbound webhooks.

**Commercial fit:** Official paid plans range from $29 to $99/month. The public API and webhooks are included in every paid plan, so integration reliability directly affects paying customers and downstream automations.

**Likely decision-maker:** CTO, Head of Engineering or the integrations/API lead.

**Tailored opening angle:** A channel-health and provider-lifecycle sprint: correct Page-token expiry semantics, expose channel state through the public API, and add a documented signed webhook contract with replay tests. Keep webhook signing as an optional second workstream if the team wants a smaller first engagement.

**Next practical action:** Recheck #2299 after PR #2380 lands or changes. Confirm #2373 and #2374 have not been picked up internally, then prepare a fixed-scope OAuth lifecycle proposal.

Sources:
- https://github.com/gitroomhq/postiz-app/issues/2299
- https://github.com/gitroomhq/postiz-app/issues/2373
- https://github.com/gitroomhq/postiz-app/issues/2374
- https://github.com/gitroomhq/postiz-app/pull/2380
- https://github.com/gitroomhq/postiz-app
- https://postiz.com/pricing

## 4. Stigg
**Score: 8.8/10**

**Observed pain:** Open issue #109, created 1 November. A subscription plan change using billingCycleAnchor = NOW is ignored by actual provisioning, even though subscriptions.preview applies it. The reporter reproduced a mismatch in immediate invoice amount, renewal date and invoice lines using Stigg and Stripe sandboxes. The issue says the TypeScript SDK passes the parameter through unchanged, so the suspected defect is in the API/provisioning path rather than the SDK itself.

This is a sandbox reproduction, not proof of a production overcharge.

**Evidence and stack:** Stigg TypeScript SDK, Stigg subscription API and Stripe sandbox integration.

**Commercial fit:** Stigg's current pricing page lists Pro at $399/month and a custom Scale tier with annual contracts. Its platform exposes SDKs, APIs, MCP, CLI and Stripe integration. Fixed-price integration and migration packages are also listed.

**Likely decision-maker:** Subscription API product lead, VP Engineering or the engineering owner of provisioning and billing-cycle logic.

**Tailored opening angle:** Build a deterministic preview/provision parity suite for immediate plan changes, proration, invoice lines, billing-period boundaries and recurring credits. Run identical fixtures through the preview and actual provisioning paths.

**Next practical action:** Check whether the API team has acknowledged the issue or opened a backend implementation. If it remains unassigned, prepare a small parity-and-regression sprint.

Sources:
- https://github.com/stiggio/stigg-typescript/issues/109
- https://github.com/stiggio/stigg-typescript
- https://www.stigg.io/pricing

## 5. Cloudroom
**Score: 8.6/10**

**Observed pain:** Open issue #106, updated 2 November. On Windows, the Devin agent advertises a browser-authentication method that Cloudroom's ACP authentication resolver does not recognise. The host skips ACP authenticate before session/new, leaving the model picker empty and session creation failing. The report includes a JSON-RPC reproduction.

**Evidence and stack:** Rust cloud core, TypeScript desktop/provider bridge, Agent Client Protocol and JSON-RPC.

**Commercial fit:** Cloudroom's official About page identifies David Ondrej as founder and describes a small team. The official pricing page currently marks Ultra at $500/month as open now, while Pro and some other tiers are marked coming soon. The FAQ lists $50 and $150 tiers, so availability is inconsistent across official pages. Treat $500 Ultra as the clearest currently confirmed paid offer.

**Likely decision-maker:** Founder David Ondrej, with the provider-integration engineer as the technical stakeholder.

**Tailored opening angle:** Add a provider-auth contract and Windows regression harness covering method discovery, browser authentication, model discovery and session creation. Keep the fix protocol-level so other ACP providers benefit too.

**Next practical action:** Reproduce against the latest Windows release and confirm the current Devin auth-method response. Verify plan availability before estimating commercial value.

Sources:
- https://github.com/davidondrej/cloudroom/issues/106
- https://github.com/davidondrej/cloudroom
- https://www.cloudroom.dev/about
- https://www.cloudroom.dev/pricing
- https://www.cloudroom.dev/docs/faq

## 6. Elmo
**Score: 8.2/10**

**Observed pain:** Open issue #936, last updated 17 October. The web server currently emits no PostgreSQL query spans to Sentry in Cloud or white-label deployments. Build-time Sentry instrumentation was disabled after enabling it caused a server-bundle crash involving pg and pg-pool module interop. This is an observability gap, not proof of a specific slow-query incident.

**Evidence and stack:** TypeScript, PostgreSQL, Drizzle, Sentry, Vite/TanStack Start and Docker.

**Commercial fit:** Elmo Cloud is self-serve, starting at $29/month. Official pricing lists higher tiers at $99, $299 and $649/month. REST API and MCP access are included on every plan, and white-label deployments are available.

**Likely decision-maker:** CTO or Cloud/runtime engineering owner.

**Tailored opening angle:** Restore PostgreSQL query instrumentation in a production-style Docker build, then prove that query spans arrive from the web server and relevant database paths without relying on a custom startup flag.

**Next practical action:** Check for a Sentry/Vite upgrade or an internal branch. Because the issue has not been updated since 17 October, verify that the observability gap is still a priority before proposal work.

Sources:
- https://github.com/elmohq/elmo/issues/936
- https://github.com/elmohq/elmo
- https://www.elmohq.com/pricing

## 7. ReachKit (reachkit.app)
**Score: 7.9/10**

**Observed pain:** Open issue #2399, created 5 November and labelled bug/ready. When Stripe retrieval fails or the webhook has not landed yet, the Checkout return route treats the result as not_paid/no_account and redirects the buyer to the pricing page. A buyer who has just paid can therefore see the Buy button again and may contact support or attempt another purchase. The issue proposes redirecting to a sign-in/status page with a clear message that the payment may have succeeded and the buyer will not be charged twice.

**Evidence and stack:** Next.js, TypeScript, Supabase client libraries and Stripe Checkout/webhooks. The webhook remains the provisioning path, with the return route designed to recover account access.

**Commercial fit:** The official reachkit.app site lists €49/month including VAT. Important qualification caveat: the repository's go-live checklist says live Stripe was configured, but its last recorded Stripe check on 2 October showed no completed live payment. I found no newer public evidence of a completed paid transaction. Treat this as an early-launch lead, not a proven revenue-generating SaaS.

This is reachkit.app, the AI visibility product, not the similarly named reachkit.ai cold-email product.

**Likely decision-maker:** Founder/technical owner of reachkit.app. Formal title was not independently verified.

**Tailored opening angle:** Make the post-Checkout return resilient to delayed webhooks and transient Stripe retrieval failures. Never send a potentially paid buyer back to the offer page. Provide an honest payment-pending/sign-in state, a safe retry and tests for the race between webhook provisioning and the success redirect.

**Next practical action:** Qualify whether a real payment has completed since the last recorded check and whether the owner wants outside help. Keep the sprint small and launch-focused.

Sources:
- https://github.com/tim-clifford6991/reachkit/issues/2399
- https://github.com/tim-clifford6991/reachkit
- https://reachkit.app/
- https://raw.githubusercontent.com/tim-clifford6991/reachkit/main/docs/GO-LIVE.md

## 8. Fivvi
**Score: 7.5/10**

**Observed pain / implementation gap:** Open issue #466, created 4 November. The issue says a pilot gym will not switch until memberships, credits, recurring payments and invoices work in Fivvi. The product cannot currently take a payment. The proposed design uses Mollie Connect for Platforms, with each gym remaining the merchant, a local payment record created before provider calls, hosted checkout, stored webhook notifications, authoritative provider-status retrieval and idempotent state transitions. Previews should use Mollie's test mode; no live money should move before the stated release gate.

This is a launch-blocking implementation requirement, not a live payment incident.

**Evidence and stack:** Mollie Connect for Platforms, Mollie payment API, hosted checkout and webhook lifecycle. Other application stack details were not independently confirmed from the issue.

**Commercial fit:** A pilot gym is explicitly waiting on the payment capability. Public pricing and budget are not established.

**Likely decision-maker:** Founder/product owner or the person responsible for the pilot rollout.

**Tailored opening angle:** Implement the Mollie connection and payment state machine as one bounded foundation: workspace connection, merchant readiness, pre-created local payment, hosted checkout, webhook inbox, provider verification, idempotent transitions and preview test-mode fixtures.

**Next practical action:** Qualify the pilot conversion date, available budget and whether the owner is open to outside implementation. Do not quote a full sprint until those are known.

Source:
- https://github.com/fivvi-app/fivvi/issues/466

## 9. Lago
**Score: 7.3/10 | Monitor, not a cold-pitch target today**

**Observed pain:** Two open payment issues remain:
- #6903: a Stripe 5xx can occur after a PaymentIntent has succeeded. Lago may mark the invoice failed, ignore the later success webhook and create a second PaymentIntent on retry, risking a duplicate charge.
- #6974: Flutterwave verification can fail transiently after the webhook has already been acknowledged. The job can finish as successful while the paid invoice remains pending.

**Pipeline correction:** Both fixes are already in open, unmerged PRs. PR #7023 keeps the Stripe payment pending and retries with the same idempotency key, then links the later webhook to the original payment. PR #7020 propagates transient Flutterwave verification errors so the job retries. Do not pitch these original fixes as untouched work.

**Evidence and stack:** Ruby/Rails, Stripe, Flutterwave, background jobs, provider webhooks and payment-status synchronization.

**Commercial fit:** Lago is API-first billing infrastructure with REST API, SDKs, webhooks and managed Cloud. Its official site lists customers including CoreWeave, Mistral AI and PayPal. This is a high-value technical product, but procurement is likely more involved than a founder-led micro-SaaS.

**Likely decision-maker:** Payments engineering lead, billing platform engineering manager or Head of Engineering.

**Tailored opening angle:** After the PRs merge, offer an independent failure-injection and regression pass across ambiguous provider responses, duplicate delivery, retry exhaustion and reconciliation.

**Next practical action:** Monitor #7020 and #7023. Requalify only after merge or if the maintainers request independent validation.

Sources:
- https://github.com/getlago/lago-api/issues/6903
- https://github.com/getlago/lago-api/issues/6974
- https://github.com/getlago/lago-api/pull/7020
- https://github.com/getlago/lago-api/pull/7023
- https://github.com/getlago/lago
- https://getlago.com/

## 10. TutorCruncher
**Score: 6.8/10 | Monitor, internally assigned**

**Observed pain:** Open issue #448, updated 23 October and assigned internally. It reports duplicate Pipedrive organisations, missing country data and first-demo reporting errors. The issue describes manually corrected records and incorrect reporting counts. This is integration/data-integrity pain, not a payment incident.

A separate older open PR #380 discusses a sales-booking webhook path that scans thousands of contact records to find a matching company. Its last update was December 2025, so it should not be presented as active implementation work.

**Evidence and stack:** Pipedrive integration, TutorCruncher API and webhooks. The official API documentation describes authenticated API access, webhook event delivery, signatures, retries and a 100-request-per-minute limit.

**Commercial fit:** TutorCruncher sells tutoring-business management software. US pricing starts at $30/month and Startup at $80/month; payments and invoicing are core product features.

**Likely decision-maker:** Head of Engineering, integrations lead or engineering manager. The current issue already has an internal assignee.

**Tailored opening angle:** Once the internal work settles, offer a data-integrity sprint around normalized organisation matching, idempotent webhook processing, a safe backfill and reporting-parity tests.

**Next practical action:** Wait for the assigned engineer's progress on #448. Do not pitch the duplicate-record fix while internal ownership is active.

Sources:
- https://github.com/tutorcruncher/hermes/issues/448
- https://github.com/tutorcruncher/hermes/pull/380
- https://github.com/tutorcruncher/hermes
- https://tutorcruncher.com/pricing/us
- https://api.tutorcruncher.com/

---

## Top three and next practical actions

| Priority | Prospect | Next practical action |
|---:|---|---|
| 1 | Backenly | Reproduce the missing-signing-secret setup, check for a fix branch, and prepare a one-sprint Stripe connection correctness proposal. |
| 2 | HeyForm | Confirm community-versus-hosted payment support, then scope the public-form payment journey from Connect through PaymentIntent confirmation and webhook processing. |
| 3 | Postiz | Recheck #2299 against PR #2380, then prepare a token-lifecycle/API-health sprint with signed webhooks as an optional extension. |

### Pipeline hygiene

- ReachKit is the product at reachkit.app. Do not confuse it with reachkit.ai.
- Cloudroom's official pricing pages disagree about which tiers are open. Treat the $500 Ultra offer as the clearest confirmed paid tier.
- HeyForm's payment issue has a community-versus-hosted scope question that must be resolved before quoting.
- ReachKit's latest public go-live evidence does not establish a completed live payment.
- Fivvi is a pilot-blocked implementation opportunity, not a production payment defect.
- Lago's two fixes are already in open PRs.
- TutorCruncher's issue is assigned internally.
- USD Impact was not included: its owner explicitly designated themselves as the sole human reviewer for an in-flight security PR, so it is not currently a credible external-services opportunity.
- OpticWorks was not included: its repository states online commerce is offline and the current checkout stops before payment.

No prospect has been contacted, no forms have been submitted, no money has been spent and no production system has been accessed or changed.
