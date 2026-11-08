# DegenDev Sprint Lead Research
## 8 November 2026

Research objective: identify founder-led SaaS, digital-product, membership and adjacent platform businesses with public evidence of payment, entitlement, webhook, PostgreSQL or integration-reliability work that can be bounded into a DegenDev sprint.

### Qualification notes
- Scores combine commercial fit, strength of public evidence, API/stack fit, likely buyer access and sprintability. They are not close probabilities.
- Production, staging, test-mode, code-review and pre-launch findings are labelled separately.
- Several leads already have a fix in progress. Those are monitor-only until the current work lands.
- No one was contacted, no forms were submitted, no money was spent, and no production systems were accessed or changed.

## Ranked pipeline

| Rank | Prospect | Score | Status | Opportunity |
|---:|---|---:|---|---|
| 1 | fazer.ai | 9.5 | Active | PostgreSQL restart resilience and pool recovery |
| 2 | Garcar Enterprise | 8.7 | Active, early commercial stage | Stripe checkout-to-download fulfillment |
| 3 | HCB / Hack Club | 8.1 | Conditional | Stripe Tap to Pay payment-intent reconciliation |
| 4 | Shirt Société | 7.5 | Conditional | Align production deployment with hardened Mollie webhook code |
| 5 | ReachKit | 7.5 | Monitor, matching PR open; pre-revenue | Keep Inngest/Stripe machine routes off page middleware |
| 6 | Pay Me Back | 7.3 | Early-stage build | Saved-card off-session charge and settlement idempotency |
| 7 | Tico | 7.2 | Monitor, matching PR open; commercial model unverified | Accurate billing/access state during failed asset loads |
| 8 | FocusBro | 7.0 | Low-priority qualification | Revoke Pro text eligibility after refunds without page visits |
| 9 | Startline | 6.8 | Pre-launch | Stripe Connect refund validation before release |
| 10 | ApexHunt AI (GitHub project) | 6.6 | Early-stage, identity/budget unverified | RevenueCat consumable-refund credit reversal |

---

## 1. fazer.ai — 9.5/10

**Observed pain:** Open issue #1737 reports that a planned PostgreSQL restart with about 20 seconds of downtime caused a production container to exit and restart three times. An idle pooled client received SQLSTATE 57P01, but the uncaught client error terminated the Node process. The issue calls for error listeners on every pool/long-lived client, bounded boot retries with backoff, and a failure-injection test using pg_terminate_backend.

**Commercial fit:** The fazer.ai GitHub profile describes an engineering company building production AI systems. Its About page names engineer co-founders Lucas Moreira and Gabriel Jablonski and reports 70+ retail branches served, 1.5M+ messages/month for AI assistants, and a white-label product with 600+ B2B clients. Its business site describes paid consulting, special AI projects and a subscription-based scale-testing service.

**Evidence / links**
- Issue: https://github.com/fazer-ai/agents/issues/1737
- Product README and stack: https://github.com/fazer-ai/agents/blob/main/README.md
- GitHub company profile: https://github.com/fazer-ai
- About / founders / customer evidence: https://fazer.ai/en/quem-somos
- Services and commercial model: https://fazer.ai/en

**Stack evidenced:** TypeScript, Bun, Elysia, Prisma, PostgreSQL + pgvector, LangGraph TS, REST API, MCP, Chatwoot integration and outbound webhooks. The issue describes multiple PostgreSQL pools and delivery-recovery paths.

**Likely decision-maker:** A co-founder / engineering lead. Lucas Moreira and Gabriel Jablonski are both identified as engineer co-founders; neither is labelled CTO in the source reviewed.

**Tailored opening angle:** A PostgreSQL resilience sprint across every pool and long-lived client: handle expected shutdown SQLSTATEs without process death, add bounded boot retry/backoff, then prove recovery with a real PostgreSQL backend-termination test and verify webhook/worker recovery after reconnect.

**Next action:** Recheck #1737 for a newly opened PR, map the pool constructors, and prepare a narrow resilience sprint. No matching PR was found in the targeted open-PR search.

---

## 2. Garcar Enterprise — 8.7/10

**Observed pain:** Open issue #20 says the GET /download endpoint verifies an entitlement but returns placeholder JSON rather than the purchased asset. The current fulfillment handler looks for Checkout Session metadata that does not match the product identifiers used by the four live Stripe Payment Links. The issue documents a one-time USD $27 Payment Link for the first digital product. A reference implementation passed 26 local tests but is not wired into the running service, and the issue explicitly says no live endpoint, webhook or email delivery has been established.

**Commercial fit:** A real fixed-price Stripe Payment Link and a named digital product provide a concrete monetization path. No completed paid orders or recurring revenue were verified, so treat this as an early-stage creator business, not an established SaaS.

**Evidence / links**
- Issue and exact Payment Link / Price details: https://github.com/Garrettc123/garcar-payments/issues/20
- Product/payment architecture README: https://github.com/Garrettc123/garcar-payments/blob/main/README.md
- Current FastAPI entry point: https://github.com/Garrettc123/garcar-payments/blob/main/app/main.py

**Stack evidenced:** Python/FastAPI, Stripe Checkout and signed webhooks, SQLAlchemy/Alembic, DATABASE_URL, Supabase entitlements/storage, HubSpot, Asana, Notion, Linear and Resend. The README describes a durable fulfillment queue with idempotent billing/fulfillment records and retry/dead-letter handling.

**Likely decision-maker:** Founder / owner and technical owner of Garcar Enterprise, represented by the repository owner. A separate executive buyer was not verified.

**Tailored opening angle:** A checkout-to-delivery correctness sprint: strict Payment Link + Price ID mapping, verified paid line items, immutable private asset storage, entitlement-bound signed downloads, webhook/session idempotency, refund/dispute revocation and buyer email recovery.

**Next action:** Validate the actual Stripe Checkout Session shape against the documented Payment Link/Price mapping, then scope the smallest end-to-end paid-download sprint. Do not claim customers have already been charged or lost files.

---

## 3. HCB / Hack Club — 8.1/10

**Observed pain:** Open issue #15608 reports that some Tap to Pay donations reach Stripe with metadata.event_id set to an organisation public ID or slug rather than the numeric event ID. The issue traces this to older mobile code creating a second PaymentIntent on-device instead of using the server-created one. The webhook can then retain the unpaid PaymentIntent ID. Finance reconciliation reads event_id from Stripe balance-transaction exports, so affected rows need manual mapping. The mobile fix was shipped as an OTA update, but the issue says affected donations were still arriving in late October.

**Commercial fit:** HCB is a large nonprofit fiscal-sponsorship and financial platform, not a founder-led SaaS. Hack Club's official page reports more than $100M in transactions and 6,500+ projects. The scale and finance-reconciliation consequences are material, but an external engineering budget and buyer access are not established.

**Evidence / links**
- Issue: https://github.com/hackclub/hcb/issues/15608
- HCB product and scale: https://v3.hackclub.com/fiscal-sponsorship/
- HCB open-source announcement and historical transaction/user scale: https://hackclub.com/fiscal-sponsorship/open-source

**Stack evidenced:** Ruby on Rails HCB backend, Stripe PaymentIntents, Stripe Terminal SDK in the mobile flow and a mobile application. No additional database or mobile framework details are inferred.

**Likely decision-maker:** Payments engineering lead or finance-platform engineering manager, with finance operations as a stakeholder. No founder-led buyer path was established.

**Tailored opening angle:** A payment-intent reconciliation sprint: make the server-created PaymentIntent authoritative, map legacy public IDs/slugs to numeric event IDs, identify records pointing at the wrong intent, and add an audit/backfill with refund-safe verification.

**Next action:** Check whether current main contains a server-side compatibility mapping or data-repair task. Quantify affected records before proposing a backfill. Keep this conditional on a real vendor budget.

---

## 6. Shirt Société — 7.5/10

**Observed pain:** Open issue #85 asks for four Mollie webhook hardening checks: return 500 on transient errors so Mollie retries, escape customer fields in email HTML, compare the provider amount with the order total, and use a conditional pending-to-paid update to prevent duplicate processing. The issue says Netlify currently deploys from a different repository, Shirtsociete2, and that approval from Yesse is needed before changing the deployment source.

**Important code-state caveat:** The current public repository's webhook file already contains several of those safeguards, including error handling, amount comparison, escaping and conditional status updates. The unresolved question is whether that code is what production deploys. This is a source-of-truth/release-integrity opportunity, not a confirmed missing-code bug.

**Commercial fit:** The official store is live, sells one-of-one vintage and match-worn football shirts, lists Mollie at checkout, and reports 1,500+ Instagram followers and six fairs attended. The site shows product price filters up to €350+.

**Evidence / links**
- Issue: https://github.com/yessefr/shirtsociete-web/issues/85
- Current webhook source: https://github.com/yessefr/shirtsociete-web/blob/main/netlify/functions/mollie-webhook.js
- Official store: https://shirtsociete.com/

**Stack evidenced:** Netlify Functions, Mollie checkout/webhooks and the current code repository. The live site confirms Mollie as a checkout method. Do not assume the separate production repository uses the same code.

**Likely decision-maker:** Owner / merchant, Yesse, as identified in the issue. This is a small business rather than a SaaS company.

**Tailored opening angle:** A deployment-source reconciliation sprint: compare the deployed Shirtsociete2 function with the hardened public function, move to one approved source of truth, then run Mollie sandbox tests for retries, amount mismatch, duplicate delivery and safe email rendering.

**Next action:** Establish which repository Netlify actually deploys and compare the deployed function before proposing code changes.

---

## 5. ReachKit — 7.5/10

**Observed pain:** Open issue #2484 says Next.js middleware also runs for every Inngest job step, Stripe webhook and health-check request. The issue reports 16 of 37 middleware cold boots on machine routes during a one-hour observation window, with Inngest generating roughly 19k–23k invocations/day. This is a measured pre-launch CPU/performance issue, not a payment-processing failure.

**Current work / commercial caveat:** Matching PR #2495 is already open. ReachKit's official site lists one €49/month plan. The repository's go-live checklist says live Stripe checkout sessions had been created but expired unpaid, and no real payment had completed as of the recorded check. This is a pre-revenue launch-readiness lead, not an established paying SaaS.

**Evidence / links**
- Issue: https://github.com/tim-clifford6991/reachkit/issues/2484
- Matching PR: https://github.com/tim-clifford6991/reachkit/pull/2495
- Repository README / product scope: https://github.com/tim-clifford6991/reachkit/blob/main/README.md
- Go-live checklist: https://github.com/tim-clifford6991/reachkit/blob/main/docs/GO-LIVE.md
- Official product and pricing: https://reachkit.app/

**Stack evidenced:** Next.js 16, TypeScript, Inngest, Stripe, Supabase and API route handlers.

**Likely decision-maker:** Founder / technical owner (repository owner); no separate engineering buyer was identified.

**Tailored opening angle:** Once the current PR merges, offer a launch-readiness verification sprint: prove machine routes bypass page middleware on ReachKit hosts, preserve the strict CSP, and test white-label host isolation plus Stripe webhook and Inngest behaviour.

**Next action:** Wait for PR #2495 and the first completed live payment. Do not pitch the already-implemented matcher change.

---

## 7. Pay Me Back — 7.3/10

**Observed pain / build requirement:** Open issue #228 specifies a new settlement flow: release the original £1 card hold, save the lead's card with consent, charge the actual guest round-ups off-session at settlement, and handle authentication-required declines with an on-session confirmation link. It requires idempotency per bill/session and a daily sweep that releases holds before expiry.

**Commercial caveat:** The product README says it is live at paymeback.dev, but issue #79 says Stripe was disabled in production at the time of the recorded go-live check. Treat this as an early-stage payment feature build, not a live payment incident or proof of paid customers.

**Evidence / links**
- Issue #228: https://github.com/caldvs/gdp/issues/228
- Production Stripe gate #79: https://github.com/caldvs/gdp/issues/79
- README / product and stack: https://github.com/caldvs/gdp/blob/main/README.md

**Stack evidenced:** Next.js 16, Hono on AWS Lambda, DynamoDB, S3, AWS CDK and Stripe. The README describes a £1 platform-fee hold and bank-transfer settlement model.

**Likely decision-maker:** Founder / technical owner, Callum, who is quoted in the issue and appears to own the product decisions.

**Tailored opening angle:** A bounded off-session settlement sprint covering SetupIntent/PaymentMethod setup, consent, release of the original hold, round-up charge, per-session idempotency, authentication-required recovery and reconciliation records.

**Next action:** Confirm Stripe live mode is enabled and the owner has approved the off-session charge policy before scoping implementation.

---

## 4. Tico — 7.2/10

**Observed pain:** Open issue #3022 reports that when a stylesheet or script fails to load, the page can show “Out of credit” and a plan-lock notice even though authenticated production checks showed positive credit and access=open. Blocking assets in Chromium and WebKit reproduces the misleading UI. This is a billing-state presentation/access-trust problem, not evidence of a failed payment or incorrect entitlement record.

**Current work:** Matching PR #3023 is already open and addresses the loading-recovery state and hiding unconfirmed payment notices. Do not pitch the same fix as untouched work.

**Commercial fit:** The current official Tico website says “Coming soon.” I could not verify a current public price or paying customer base in this run. The commercial model is therefore unqualified, despite the issue describing an authenticated production check.

**Evidence / links**
- Issue: https://github.com/ticoteam/tico/issues/3022
- Matching PR: https://github.com/ticoteam/tico/pull/3023
- Current official site: https://tico.dev/
- Setup / hosting flow: https://tico.dev/setup
- Product README: https://github.com/ticoteam/tico/blob/main/docs/README.md

**Stack evidenced:** The README describes a self-hosted team application with a small server and separate runner. The issue concerns billing/plan-lock UI and asset loading. This is not a PostgreSQL opportunity.

**Likely decision-maker:** Founder / product engineering owner. A named buyer and current commercial owner were not independently confirmed.

**Tailored opening angle:** After PR #3023 lands, offer a failure-state regression sprint covering asset-load failures, stale cloud state, actual locked/frozen states and recovery actions that never unlock access on a failed check.

**Next action:** Monitor PR #3023 through merge and release. Requalify the business only if the company publishes a live paid offer or confirms an active customer base.

---

## 8. FocusBro — 7.0/10

**Observed pain:** Open P3 issue #466 says a fully refunded one-time Pro purchase may continue to qualify a user for Pro text follow-ups until a page visit triggers a refund recheck. The issue explicitly says the test has not been run; the suspected cost leak is a hypothesis, not a confirmed production incident. The product has no Stripe webhook configured because the current key is restricted.

**Commercial fit:** FocusBro is a founder-built focus/accountability product with optional paid text follow-ups and a one-time Pro purchase, not a subscription SaaS. Founder Adrian Perry is named on the official About page.

**Evidence / links**
- Issue: https://github.com/Latimer-Woods-Tech/focusbro/issues/466
- Official product: https://focusbro.net/
- About / founder: https://focusbro.net/about.html
- Payments/privacy description: https://focusbro.net/?tool=focus

**Stack evidenced:** Cloudflare-hosted app, Stripe one-time Pro purchase and scheduled text follow-ups. The issue references D1 and the delivery cron. No broader backend stack is asserted.

**Likely decision-maker:** Founder Adrian Perry.

**Tailored opening angle:** A small refund-to-entitlement sprint: ensure a fully refunded Pro purchase is excluded from future text sends without requiring a page visit, while partial refunds retain eligibility, and add a bounded reconciliation meter.

**Next action:** Do not pitch until the owner runs the stated test or confirms the issue. It's P3 and currently unverified.

---

## 9. Startline — 6.8/10

**Observed pain / release gate:** Open issue #496 requires Stripe test-mode verification of event-change refunds and transfer reversals. The implementation is unit-tested against mocked Stripe only. Required cases include group bookings, organiser fee allocation, shortfall accounting, payout balance and idempotent retries.

**Current work / commercial caveat:** Draft PR #501 implements event editing and full refund entitlement but is waiting on #496 and another E2E issue. The official site says “Launching Soon”; no public paid customer or pricing evidence was found.

**Evidence / links**
- Issue: https://github.com/StartlineAU/startline-web-app/issues/496
- Draft PR: https://github.com/StartlineAU/startline-web-app/pull/501
- Repository README / product and stack: https://github.com/StartlineAU/startline-web-app/blob/main/README.md
- Official site: https://startlineau.com/

**Stack evidenced:** Next.js 15, TypeScript, PostgreSQL 15, Prisma, AWS Cognito, Stripe Connect Express, Resend and AWS Amplify.

**Likely decision-maker:** Founder / engineering lead at Startline Pty Ltd. The public launch page identifies the registered company but not a named technical buyer.

**Tailored opening angle:** A pre-launch Stripe Connect refund-validation sprint with real test-mode charges and connected-account balance checks, focused on the seven cases in #496.

**Next action:** Wait for the draft PR to reach the test gate and verify whether the company is willing to fund external QA before launch.

---

## 10. ApexHunt AI GitHub project — 6.6/10

**Observed pain:** Open issue #6 says RevenueCat's CANCELLATION event is treated as a no-op for all purchases. That is correct for some subscription cancellation semantics but wrong for consumable credit packs: after a $25 pack is refunded, the credits remain. The issue is a code-review finding during a v1.0 QA pass, not a verified production refund.

**Identity / commercial caveat:** This is specifically the GitHub project avsoarsa/apexhunt-ai, which describes a Flutter app and FastAPI gateway. I did not verify a public company, published pricing, paying customers or a live app-store listing. Do not confuse this repository with the separate apexhunt.ai website; that site explicitly says it is not affiliated with similarly named apps.

**Evidence / links**
- Issue #6: https://github.com/avsoarsa/apexhunt-ai/issues/6
- Project README: https://github.com/avsoarsa/apexhunt-ai/blob/main/apexhunt/README.md
- Google Play setup / RevenueCat architecture: https://github.com/avsoarsa/apexhunt-ai/blob/main/apexhunt/docs/SETUP.md
- Separate apexhunt.ai identity clarification: https://www.apexhunt.ai/about

**Stack evidenced:** Flutter Android app, FastAPI gateway, RevenueCat webhooks, Supabase/PostgreSQL wallet ledger and Render/Railway/Fly hosting options.

**Likely decision-maker:** Repository owner / technical founder. A commercial buyer or registered company was not independently established.

**Tailored opening angle:** If the app is live and has a paid user base, build a RevenueCat purchase-type-aware refund handler: distinguish consumables from subscriptions, reverse the refunded pack once using transaction idempotency, and test replay, partial/duplicate delivery and negative-balance handling.

**Next action:** Verify the project has a live app and paying users before spending time on a proposal. Until then, keep it as a low-cost watch lead.

---

## Top three and next practical action

| Priority | Prospect | Next practical action |
|---:|---|---|
| 1 | fazer.ai | Verify #1737 still has no fix PR, map the pool/client lifecycle, and draft a PostgreSQL restart-resilience sprint. |
| 2 | Garcar Enterprise | Validate Payment Link/Price-to-session mapping and prepare a bounded paid-download fulfillment proposal. |
| 3 | HCB / Hack Club | Check whether current main has a server-side reconciliation/backfill for legacy Tap to Pay records; qualify whether external engineering budget exists. |

### Monitor rather than pitch today
- **Tico:** matching PR #3023 is already open.
- **ReachKit:** matching PR #2495 is already open, and the repo says no real payment had completed at the recorded go-live check.
- **Shirt Société:** current public code already contains several requested safeguards; verify the actual Netlify deployment source first.
- **Pay Me Back:** Stripe was recorded as disabled in production; this is a planned feature build, not a live payment failure.
- **FocusBro:** P3 refund-revocation concern is not yet reproduced.
- **Startline:** pre-launch, and the refund PR is still gated on test-mode validation.
- **ApexHunt AI:** code-review finding only; company and paying-customer status unverified.

### Excluded after qualification checks
- **Verenigingen:** issue #2244 is technically serious and reproduces duplicate live Mollie payment creation plus a webhook that fails to book the invoice, but the issue says no normal UI path currently creates that checkout, and PR #2247 deliberately gates the Sales Invoice path until the issue is fixed. No commercial budget was established. Issue: https://github.com/nlvegan/verenigingen/issues/2244 · gate PR: https://github.com/nlvegan/verenigingen/pull/2247
- **OtterQuote / ClaimShield:** repository README and public website evidence did not establish that the issue repository and the public product belong to the same business. Excluded rather than conflated.
- **Paytrick:** repository describes a Sprint 1 payment-gateway foundation, but no operating company, public customer base or commercial pricing was verified.

No outreach, forms, spending, or production access occurred.
