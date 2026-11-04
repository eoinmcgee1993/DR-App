# DegenDev Sprint Lead Research
## 4 November 2026

Research scope: founder-led SaaS, API products, digital products and membership businesses with public evidence of payment, subscription entitlement, webhook, OAuth/API or database reliability work.

This report contains six fresh prospects and four requalified carryovers. Scores reflect commercial fit, strength of evidence, API/stack suitability, buyer accessibility and whether a fixed-scope sprint is plausible. They are qualification scores, not close probabilities.

No one was contacted. No forms were submitted. No money was spent. No private systems or production accounts were accessed.

## Ranked pipeline

| Rank | Prospect | Score | Status | Best sprint angle |
|---:|---|---:|---|---|
| 1 | NotaFácil / Nota MEI Gateway | 9.6 | Fresh, high priority | Stripe webhook isolation, reconciliation and paid quota correctness |
| 2 | Lago | 9.3 | Carryover, still open | Ambiguous payment outcomes and duplicate-charge prevention |
| 3 | Postiz | 9.1 | Fresh, high priority | Meta OAuth lifecycle, channel-health API and signed outbound webhooks |
| 4 | Stigg | 8.8 | Carryover, still open | Subscription preview/provision parity |
| 5 | Elmo | 8.5 | Fresh, good fit | PostgreSQL query tracing and production observability |
| 6 | Cloudroom | 8.2 | Carryover, early access | ACP authentication and Windows session reliability |
| 7 | TutorCruncher | 7.7 | Carryover, monitor | Pipedrive sync idempotency and webhook lookup performance |
| 8 | Limiara | 7.3 | Fresh, early product | Stripe adapter and subscription/webhook foundation |
| 9 | PublicTech | 7.1 | Fresh, early product | Stripe subscription, donation and entitlement provisioning |
| 10 | Capabble | 6.9 | Fresh, conditional | Trial eligibility and Razorpay subscription-state correctness |

---

## 1. NotaFácil / Nota MEI Gateway
**Score: 9.6/10 | High priority**

### Commercial fit
NotaFácil sells an NFS-e product for Brazilian MEIs and an API product for businesses and developers. Its published plans include MEI subscriptions at R$19.90, R$39.90 and R$79.90 per month. The API Business plan is R$299.90/month and includes API keys, webhooks and a 99.9% contractual SLA. EPP Scale is quote-based and includes dedicated technical onboarding.

### Observed pain
Three open issues describe a real first-customer billing and webhook problem:

- #259: the production Stripe webhook endpoint had been rejecting events because the configured Stripe API version did not match the Go SDK's expected version. The issue says the mismatch was corrected in commit `cfb903a`. The same report says there was no alerting for rejected webhook deliveries or active Stripe subscriptions without a corresponding plan record.
- #260: the live Stripe account still has endpoint-configuration problems, including incorrect destinations and a staging endpoint receiving live events. The issue also identifies a configured route that doesn't exist.
- #257: the first paying customer was charged, but failed issuance attempts had consumed quota, leaving the paid plan showing 2 of 30 uses. The owner manually reset the allowance.

Important distinction: the original version mismatch is reported as fixed. The opportunity is the remaining live/test isolation, monitoring, reconciliation and quota-accounting work, not a duplicate fix for the closed root cause.

### Stack evidenced
Go 1.23, Fiber, PostgreSQL 15 via Supabase, Redis, RabbitMQ, AWS KMS/Secrets Manager, Next.js 14, Stripe Checkout, Customer Portal and Stripe Subscriptions. The API product documents HMAC-SHA256-signed status webhooks.

### Likely decision-maker
Founder or technical owner at ScantelburyDevs. The repository owner is actively documenting and resolving the billing issues; formal title and external purchasing authority aren't independently confirmed.

### Tailored opening angle
"I saw that the Stripe API-version mismatch was corrected after the first paying customer hit the webhook failure. The remaining risks are the live/test endpoint mix-up, missing delivery/reconciliation alerts and failed issuance attempts consuming paid quota. I'd package those into one billing-reliability sprint, with signed-event replay tests, endpoint-environment checks and a reconciliation report that proves Stripe subscription state matches local plan and quota state."

### Next action
Review the latest changes around #259, #260 and #257, then prepare a narrowly scoped proposal. Do not claim the original webhook mismatch is still unfixed.

Sources:
- https://github.com/christopheScantelbury/nota-mei-gateway/issues/259
- https://github.com/christopheScantelbury/nota-mei-gateway/issues/260
- https://github.com/christopheScantelbury/nota-mei-gateway/issues/257
- https://github.com/christopheScantelbury/nota-mei-gateway
- https://www.emitirnotafacil.com.br/precos

## 2. Lago
**Score: 9.3/10 | Carryover, still open**

### Commercial fit
Lago is an API-first metering and billing platform for subscriptions, usage-based and hybrid pricing. It offers self-hosted and managed options, REST APIs, official SDKs and signed webhooks. Public customer examples include Mistral AI and PayPal. Managed pricing is quoted rather than listed.

### Observed pain
Both issues remain open as of 4 November:

- #6903: a Stripe PaymentIntent request returns HTTP 500 even though the payment succeeded. Lago marks the invoice failed, fails to associate the successful webhook with the payment and can create another PaymentIntent on retry. The reporter reproduced duplicate charges in three out of three attempts.
- #6974: a Flutterwave verification call fails transiently with 429, 503 or timeout after the webhook has already been acknowledged. The background job treats verification failure as successful completion, leaving the invoice pending with no retry.

These are reproducible reports, not evidence that every Lago customer is affected.

### Stack evidenced
Ruby/Rails backend, Stripe and Flutterwave integrations, asynchronous payment jobs, REST API and webhook processing. Don't assume a specific database performance problem from these two issues.

### Likely decision-maker
Head of Engineering, payment integrations lead or billing product engineering manager.

### Tailored opening angle
"There's a dangerous difference between a provider request failing and a payment actually failing. I'd isolate the ambiguous Stripe outcome from the Flutterwave verification retry path, make both recoverable and idempotent, and add deterministic tests proving that a successful provider payment can never be charged again just because the first response was ambiguous."

### Next action
Check for maintainer acknowledgement or an issue-specific implementation before preparing a proposal. Keep Stripe ambiguous-outcome recovery and Flutterwave retry handling as separate acceptance tracks.

Sources:
- https://github.com/getlago/lago-api/issues/6903
- https://github.com/getlago/lago-api/issues/6974
- https://github.com/getlago/lago
- https://getlago.com/
- https://getlago.com/developers

## 3. Postiz
**Score: 9.1/10 | Fresh, high priority**

### Commercial fit
Postiz is a hosted social-media management platform with a public API, webhooks, MCP server and CLI. Its public plans range from $29 to $99/month, and every plan includes the API and webhooks.

### Observed pain
Three open issues create a coherent integration-reliability opportunity:

- #2299: Facebook and Instagram channels are assigned a fixed 59-day token expiry even after the page picker replaces the user token with a Page access token that doesn't expire on that schedule. After 59 days, valid channels can be marked as needing refresh and scheduled posts can fail. Instagram status and permalink calls also use the expiring user token in paths where the Page token is available.
- #2373, opened 4 November: the public integrations API doesn't expose existing channel-health fields such as `refreshNeeded`, `inBetweenSteps` and `tokenExpiration`. API clients can discover a broken channel only when a scheduled post fails.
- #2374, opened 4 November: outbound webhooks are unsigned and the payload shape isn't documented. The issue proposes optional per-webhook secrets, HMAC-SHA256 signatures and timestamp headers.

The two 4 November items are feature requests with detailed technical rationale, not confirmed security incidents.

### Stack evidenced
TypeScript, NestJS, Prisma, PostgreSQL, provider-specific OAuth integrations, a public REST API and an orchestrator/workflow layer.

### Likely decision-maker
CTO, Head of Engineering or the integrations lead responsible for social-provider authentication and the public API.

### Tailored opening angle
"I'd treat channel health and webhook authenticity as one integration-contract sprint. Fix the Page-token expiry semantics, expose channel health before clients schedule posts, then add optional timestamped HMAC signatures and a versioned webhook payload contract. That gives agencies and downstream tools a way to detect a failing channel before a missed publishing window."

### Next action
Confirm whether the maintainer has accepted or started work on #2299, #2373 and #2374. The scope should be sold as a combined integration-hardening sprint, not three unrelated feature tickets.

Sources:
- https://github.com/gitroomhq/postiz-app/issues/2299
- https://github.com/gitroomhq/postiz-app/issues/2373
- https://github.com/gitroomhq/postiz-app/issues/2374
- https://github.com/gitroomhq/postiz-app
- https://postiz.com/pricing
- https://docs.postiz.com/public-api

## 4. Stigg
**Score: 8.8/10 | Carryover, still open**

### Commercial fit
Stigg sells subscription, usage, credits and entitlements infrastructure. Its public pricing lists a free Build tier and Pro at $499/month, with API, SDK, Stripe integration and webhook capabilities.

### Observed pain
Issue #109 remains open and unassigned. It reports that `billingCycleAnchor: 'NOW'` is applied by subscription preview but ignored by actual provisioning during a plan change. The reported preview and provision results disagree on both the immediate invoice and the next renewal date.

This is an API consistency problem. The report uses Stripe sandbox data; it isn't proof of a live customer overcharge.

### Stack evidenced
TypeScript SDK, REST and GraphQL provisioning paths, Stripe sandbox integration.

### Likely decision-maker
Subscription API engineering lead, SDK lead or VP/Head of Product Engineering.

### Tailored opening angle
"I'd build a preview-to-provision parity suite around immediate plan changes, proration, invoice lines and billing-period boundaries. The same fixture should produce the same commercial outcome through REST, GraphQL and the TypeScript SDK."

### Next action
Check whether the backend team has accepted the reproduction. Avoid an SDK-only patch if the mismatch originates in the provisioning service.

Sources:
- https://github.com/stiggio/stigg-typescript/issues/109
- https://github.com/stiggio/stigg-typescript
- https://www.stigg.io/pricing

## 5. Elmo
**Score: 8.5/10 | Fresh, good fit**

### Commercial fit
Elmo is an open-source AI visibility product with a managed Cloud service. The official site says it is used by 200+ brands. Cloud pricing ranges from $29/month to $649/month, with API and MCP access on every plan.

### Observed pain
Issue #936 remains open. The web server currently sends no PostgreSQL query spans to Sentry in cloud or white-label deployments. Re-enabling Sentry build-time instrumentation previously crashed the server bundle because of a `pg` / `pg-pool` module interop problem. The current Vite config still has `buildTimeInstrumentation: false`.

Pipeline hygiene:
- Issue #707 has an open fix PR, #853. Don't pitch that API pagination correction as untouched work.
- Issue #439 documents a previous 10x run/API-spend incident. The current main branch now contains a one-hour expedite floor, so don't pitch the original missing-throttle fix as though it remains absent. The issue itself is still open and provider-failure handling may merit separate review.

### Stack evidenced
TypeScript, PostgreSQL, Drizzle, Sentry, pg-boss and a TanStack Start/Vite server build.

### Likely decision-maker
Founder/technical lead or engineering owner responsible for the Cloud runtime and observability.

### Tailored opening angle
"Your web server still has no PostgreSQL query spans in Sentry because build-time instrumentation is disabled after the pg/pg-pool bundling crash. I'd isolate the module-format issue, ensure one instrumented pg copy is shared by Drizzle/admin/worker paths, and prove DB spans arrive in a production-style Docker build without a custom --import startup flag."

### Next action
Check whether #936 has an implementation branch or a newer Sentry upgrade. Scope only the web-server tracing path first; the worker issue is explicitly separate.

Sources:
- https://github.com/elmohq/elmo/issues/936
- https://github.com/elmohq/elmo/issues/439
- https://github.com/elmohq/elmo/issues/707
- https://github.com/elmohq/elmo/pull/853
- https://github.com/elmohq/elmo
- https://www.elmohq.com/
- https://www.elmohq.com/pricing

## 6. Cloudroom
**Score: 8.2/10 | Carryover, early access**

### Commercial fit
Cloudroom is a cloud workspace for coding agents with an open-source Rust core and desktop application. The public pricing page shows an Ultra tier at $500/month as open, while some lower tiers are marked coming soon; the FAQ also lists $50 and $150 tiers. Treat the plan-availability information as inconsistent and qualify actual paid usage before quoting a sprint.

### Observed pain
Issue #106 remains open. On Windows, the Devin agent advertises a browser authentication method that Cloudroom's ACP authentication resolver doesn't recognise. The host therefore doesn't call ACP `authenticate` before `session/new`, leaving the model picker empty and session creation failing. The reporter reproduced it on two Devin CLI versions.

### Stack evidenced
Rust cloud core, TypeScript desktop layer and Agent Client Protocol JSON-RPC integration.

### Likely decision-maker
Founder/technical lead responsible for the ACP bridge and agent-provider integrations.

### Tailored opening angle
"I'd make the provider authentication contract explicit, add a Windows regression harness and verify the full sequence: method discovery, browser authentication, model discovery and session creation. Keep OOM recovery as a separate follow-on."

### Next action
Reproduce against the latest release and confirm whether Devin's auth-method behaviour has changed. Verify the current paid-plan availability before treating this as a near-term commercial buyer.

Sources:
- https://github.com/davidondrej/cloudroom/issues/106
- https://github.com/davidondrej/cloudroom
- https://www.cloudroom.dev/pricing
- https://www.cloudroom.dev/docs/faq

## 7. TutorCruncher
**Score: 7.7/10 | Carryover, monitor rather than pitch now**

### Commercial fit
TutorCruncher is an established tutoring-management SaaS. UK pricing starts at £25/month, with Startup from £60/month. Its product includes payments, invoicing, scheduling and API/integration capabilities.

### Observed pain
- #448 remains open and describes duplicate Pipedrive organisations, missing country data and first-demo reporting errors.
- #456 remains open and defines a guarded backfill for booking-only organisations.
- Both issues are assigned to an internal engineer.
- Open PR #380 explicitly notes that the sales-booking webhook path scans thousands of contact records to find a match. It suggests caching or indexing as possible approaches.

### Stack evidenced
Python, FastAPI, PostgreSQL, SQLModel/SQLAlchemy, Pipedrive API and TutorCruncher webhooks.

### Likely decision-maker
Head of Engineering, integrations lead or engineering manager. Revenue Operations is a stakeholder.

### Tailored opening angle
"Once the current internal work settles, I'd offer a bounded integration-performance pass: idempotent organisation matching, normalized lookup keys, indexed webhook lookups and a safe backfill with reporting-parity tests."

### Next action
Do not approach with a duplicate fix while internal engineers are assigned. Recheck #448, #456 and PR #380 after the current work lands.

Sources:
- https://github.com/tutorcruncher/hermes/issues/448
- https://github.com/tutorcruncher/hermes/issues/456
- https://github.com/tutorcruncher/hermes/pull/380
- https://github.com/tutorcruncher/hermes
- https://tutorcruncher.com/pricing/gb
- https://api.tutorcruncher.com/

## 8. Limiara
**Score: 7.3/10 | Fresh, early product**

### Commercial fit
Limiara's public site lists a free tier, Inicial at R$49.90/month and Equipe at R$849/month. It offers an MCP connector. The site also says it doesn't yet integrate with ERP or bank systems and doesn't expose a general API for those workflows.

### Observed pain / implementation gap
Issue #132, opened 4 November and carried over from the archived repository, asks for a provider-neutral payment boundary with Stripe as the first implementation. The requested scope includes payment-link/session creation, payment status, refund status, customer mapping, invoice association and webhook reconciliation. It explicitly says not to store card data and to keep provider references auditable.

The main qualification issue is product maturity: the current repository README says the foundation scaffold is delivered but the secure Contacts vertical slice has not shipped end to end. The public plans show commercial intent, but this isn't evidence of an established paid customer base.

### Stack evidenced
Rust services, React/Vite frontend, PostgreSQL and NATS in the current platform scaffold. Stripe is the proposed initial payment provider, not an already working integration.

### Likely decision-maker
Founder/product owner.

### Tailored opening angle
"Once the core Contacts workflow is deployed, I'd implement a narrow provider boundary for Checkout, payment status, refunds and signed webhook reconciliation, with no card data stored locally and explicit test/live separation."

### Next action
First verify that the signup-to-working-app path and Contacts vertical slice are live. If they're not, defer a full payment sprint. A short integration design/implementation spike is the most that makes sense today.

Sources:
- https://github.com/buchochelliq-labs/limiara-core/issues/132
- https://github.com/buchochelliq-labs/limiara-core
- https://limiara.com/
- https://limiara.com/planos/

## 9. PublicTech
**Score: 7.1/10 | Fresh, early product**

### Commercial fit
The repository describes PublicTech as a civic-journalism and government-data product with Analyst, Newsroom and Institutional subscription tiers plus one-time and recurring supporter donations. I didn't find independent evidence of paying customers, public prices or a separate marketing site, so commercial maturity remains unverified.

### Observed pain / implementation gap
Issue #16, opened 4 November, says five product pages link to /pricing and /upgrade routes that return 404 because billing templates and Stripe webhook handlers aren't wired. The proposed implementation includes:

- Pricing, upgrade and donation pages.
- Stripe Checkout and Customer Portal.
- Raw-body Stripe signature verification.
- Subscription lifecycle events for upgrades, downgrades, deletion and failed payment.
- Automatic access-tier and one-time-visible MCP token provisioning.
- Donation receipt emails.

The issue estimates about 10 hours. That is a small implementation job, not a full DegenDev sprint unless expanded into release hardening and lifecycle acceptance.

### Stack evidenced
WordPress/PHP theme and REST routes, Stripe API and MCP bearer-token provisioning, as described in the repository issue.

### Likely decision-maker
Solo product owner/maintainer. Formal company status and budget are unverified.

### Tailored opening angle
"Rather than just wiring Checkout, I'd make the signed webhook the source of truth for tier access and MCP token provisioning, then test payment failure, downgrade, cancellation, donation receipts and replay behaviour. The result should be a working paid-access lifecycle, not just a checkout button."

### Next action
Confirm the product is actively being commercialised and that the owner wants outside implementation help. Don't quote a standard multi-day sprint for a ticket the owner estimates at 10 hours.

Sources:
- https://github.com/awfmilton/govdata/issues/16
- https://github.com/awfmilton/govdata

## 10. Capabble
**Score: 6.9/10 | Fresh, conditional**

### Commercial fit
Capabble is a multi-tenant examination-management platform for CBSE examination centres. The repository describes React/TypeScript, Node/Express and MongoDB. Its billing test issue documents Razorpay test payments and a 14-day trial. A staging test uses a school with 850 students, but that isn't proof of 850 paying users. No public pricing was verified.

### Observed pain
Issue #65, opened 4 November, says the Billing "Choose modules" action can bypass a school's free trial. For a school in `setup_required`, the backend creates a `suspended_read_only` subscription and an invoice due immediately. The school becomes read-only until payment even though the UI says the action should start a free trial.

The reporter says this was found on staging and that the same code is on live. That does not establish that a live customer has already been affected.

### Stack evidenced
React 18/TypeScript, Node.js/Express, MongoDB/Mongoose, multi-tenant subdomains and Razorpay in the billing test path.

### Likely decision-maker
Founder or engineering lead responsible for school onboarding and billing.

### Tailored opening angle
"I'd enforce trial eligibility on the server, not just the plan-selection UI, then add lifecycle tests for setup_required, trial_started, payment_due, paid and suspended_read_only. The key acceptance test is that no client request can skip a valid free trial."

### Next action
Check whether the owner has already patched #65 and whether the free-period/launch pricing model is still active. Budget and public pricing need qualification before proposal work.

Sources:
- https://github.com/vpnbeni/capabble/issues/65
- https://github.com/vpnbeni/capabble/issues/54
- https://github.com/vpnbeni/capabble
---

## Pipeline changes and exclusions

- **Lago, Stigg, Cloudroom and TutorCruncher** are carryovers. Their key issues remain open, but they aren't all equally ready to pitch.
- **Elmo #707 is not an open sales opportunity:** PR #853 is already open to fix it. The original scheduler throttle concern in #439 is also partly mitigated in current main by a one-hour expedite floor. The stronger remaining angle is PostgreSQL query instrumentation in #936.
- **NotaFácil's original Stripe API-version mismatch is reported fixed.** The open opportunity is the remaining endpoint isolation, monitoring, reconciliation and quota correctness.
- **Limiara and PublicTech** are early implementation opportunities, not proven established SaaS buyers.
- **Capabble's trial issue is a staging reproduction.** Don't call it a confirmed production incident.
- GiftFlow was not promoted because the current public issue only contains a screenshot and a request to improve Stripe connection UX. Forth Canoe Club has a real membership-payment workflow but is a volunteer-run charity, so budget fit is weak. FreeCorps NFE's annual billing activation remains gated on legal/operational acceptance. Toof is still at PRD/phase-planning stage with no public pricing or customer evidence.

## Top three and next practical action

1. **NotaFácil:** prepare a short Stripe reliability proposal around live/test endpoint separation, webhook monitoring/replay, subscription reconciliation and quota correctness. The original API-version bug is already fixed.
2. **Lago:** prepare a payment-outcome correctness proposal with separate Stripe ambiguous-result and Flutterwave retry acceptance tests. First confirm no internal fix has started.
3. **Postiz:** prepare a combined Meta token-lifecycle and outbound-webhook contract sprint. Verify issue #2299 and the two fresh API/webhook requests are still unassigned before pricing.

No prospect has been contacted, no form has been submitted and no production system has been accessed or changed.
