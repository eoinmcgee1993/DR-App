# DegenDev Sprint Lead Research
**Research date:** 5 November 2026  
**Scope:** Founder-led SaaS, developer products, membership and digital-product platforms with public evidence of payment, subscription, database or integration reliability work.

Scores are a practical qualification judgement, not a probability of winning work. They weigh commercial evidence, the specificity of the pain, API/stack fit, likely buyer access and whether a fixed-scope sprint is plausible.

## Executive ranking

| Rank | Prospect | Score | Pipeline status | Best sprint angle |
|---:|---|---:|---|---|
| 1 | Stigg | 9.3 | Active | Subscription preview/provision parity |
| 2 | Postiz | 9.2 | Active | OAuth channel health and signed webhook contract |
| 3 | Cloudroom | 9.0 | Active | ACP authentication and provider-session compatibility |
| 4 | Backenly | 8.8 | Active | Stripe connection readiness and webhook setup |
| 5 | Elmo | 8.6 | Active | PostgreSQL tracing and production observability |
| 6 | ERPlora | 8.4 | Active | Safe database retry and idempotent financial operations |
| 7 | Fivvi | 7.9 | Early-stage qualification | Mollie Connect payment foundation |
| 8 | Cire / English Street Ventures | 7.6 | Early-stage qualification | Stripe Connect account reuse and ownership integrity |
| 9 | TutorCruncher | 7.3 | Monitor only | CRM identity, sync and reporting integrity |
| 10 | Lago | 7.0 | Monitor only, fixes in flight | Payment retry and reconciliation regression assurance |

---

## 1. Stigg
**Score: 9.3/10 | Active**

**Observed signal**

Open issue [#109](https://github.com/stiggio/stigg-typescript/issues/109) reports that a subscription plan change with `billingCycleAnchor: 'NOW'` produces different results in `subscriptions.preview` and `subscriptions.provision`. The reporter reproduced it in a Stigg sandbox with Stripe sandbox billing. The preview applies the new anchor and returns a different immediate invoice and renewal date from the actual provisioned subscription. The issue reporter believes the TypeScript SDK passes the field through and the mismatch is in the API. This is a sandbox reproduction, not evidence of a production overcharge.

**Commercial evidence**

Stigg's published Build tier is free. Its Pro tier is listed at $499/month and includes webhooks, audit log, a 99.95% SLA and higher event throughput. The product sells subscription, usage, credits and entitlements infrastructure. [Official pricing](https://www.stigg.io/pricing).

**Stack evidenced**

TypeScript SDK, REST and GraphQL provisioning paths, Stripe sandbox. Do not assume the bug is in the SDK.

**Likely decision-maker**

Subscription API engineering lead, Head of Product Engineering or CTO.

**Tailored opening angle**

> Your preview and provision paths appear to disagree when an immediate plan change requests a new billing-cycle anchor. I'd build a deterministic parity suite across REST, GraphQL and the TypeScript SDK, then verify invoice amounts, period boundaries and recurring-credit behaviour against the same fixtures.

**Next action**

Check whether the API team has accepted the reproduction or started a backend fix. If not, propose a bounded preview/provision parity sprint. Avoid selling an SDK-only patch until the API ownership is clear.

**Sources:** [Issue #109](https://github.com/stiggio/stigg-typescript/issues/109) · [Official pricing](https://www.stigg.io/pricing) · [TypeScript SDK](https://github.com/stiggio/stigg-typescript)

---

## 2. Postiz
**Score: 9.2/10 | Active**

**Observed signal**

Three open issues create a coherent integration-reliability opportunity:

- [#2299](https://github.com/gitroomhq/postiz-app/issues/2299) reports Facebook and Instagram Page-token channels being marked as needing refresh after 59 days, even though the Page token may remain valid. Instagram status and permalink calls also use the expiring user token in paths where the Page token is available. Scheduled publishing can stop when the channel is incorrectly marked unhealthy.
- [#2373](https://github.com/gitroomhq/postiz-app/issues/2373), opened 4 November, asks the public integrations API to expose existing channel-health fields such as `refreshNeeded`, `inBetweenSteps` and `tokenExpiration`. This is a feature request, not a confirmed outage.
- [#2374](https://github.com/gitroomhq/postiz-app/issues/2374), also opened 4 November, asks for optional per-webhook HMAC-SHA256 signatures and timestamp headers. The current outbound webhook payload is sent without a signature. This is a hardening request, not evidence that a customer has been attacked.

**Commercial evidence**

Postiz publishes four paid plans from $29 to $99/month. The official pricing page says public API and webhooks are included in paid plans. [Official site and pricing](https://postiz.com/).

**Stack evidenced**

TypeScript, NestJS backend, Prisma, PostgreSQL, orchestrator workflows, social-provider OAuth, public REST API and outbound webhooks, all visible in the issue code references.

**Likely decision-maker**

Head of Engineering, integrations/API lead or CTO.

**Tailored opening angle**

> I'd treat channel health and webhook authenticity as one integration-contract sprint. Correct the Page-token lifecycle, expose channel health before clients schedule posts, then add optional timestamped HMAC signatures with a versioned payload contract and replay tests.

**Next action**

Confirm no maintainer PR has started for #2299, #2373 or #2374. Scope the three together only if the team agrees they're one release objective. Otherwise, lead with the concrete token lifecycle defect.

**Sources:** [#2299](https://github.com/gitroomhq/postiz-app/issues/2299) · [#2373](https://github.com/gitroomhq/postiz-app/issues/2373) · [#2374](https://github.com/gitroomhq/postiz-app/issues/2374) · [Official pricing](https://postiz.com/)

---

## 3. Cloudroom
**Score: 9.0/10 | Active**

**Observed signal**

Open issue [#106](https://github.com/davidondrej/cloudroom/issues/106) reports that the Devin ACP agent cannot start sessions or populate the model picker on Windows. Devin advertises a browser authentication method, but Cloudroom's resolver does not recognise that method, so the host skips ACP `authenticate` before `session/new`. The issue includes a raw JSON-RPC reproduction: session creation fails before authentication and succeeds after the authentication call.

**Commercial evidence**

Cloudroom is a founder-led cloud workspace for coding agents. Its official About page identifies a founder and describes managed cloud sandboxes. The pricing page currently marks Ultra at $500/month as open, while Free and Pro are marked as coming soon. Other official pages describe $50 and $150 tiers, so only the $500 open tier should be treated as clearly available without further confirmation. [About](https://www.cloudroom.dev/about) · [Pricing](https://www.cloudroom.dev/pricing).

**Stack evidenced**

Rust cloud core, TypeScript desktop/GUI layer, Agent Client Protocol and JSON-RPC provider bridge.

**Likely decision-maker**

Founder or engineering lead responsible for provider integrations.

**Tailored opening angle**

> I found a concrete ACP compatibility failure: Devin advertises browser auth, but the bridge doesn't resolve its auth method, so the host never authenticates before opening a session. I'd add a provider-auth contract, Windows regression harness and end-to-end checks for auth discovery, model discovery and session creation.

**Next action**

Reproduce against the latest release and confirm whether the failure still exists. Keep OOM recovery and other agent lifecycle work out of the initial scope.

**Sources:** [Issue #106](https://github.com/davidondrej/cloudroom/issues/106) · [Official About](https://www.cloudroom.dev/about) · [Official pricing](https://www.cloudroom.dev/pricing) · [Repository](https://github.com/davidondrej/cloudroom)

---

## 4. Backenly
**Score: 8.8/10 | Active**

**Observed signal**

Open issue [#611](https://github.com/backenly/backenly/issues/611) identifies a misleading Stripe integration state. The console says Stripe is connected when the secret API key is present, but the webhook receiver rejects events with HTTP 401 until the signing secret is configured. The UI doesn't show the webhook URL, and the secret cannot be added cleanly without reopening the connection flow. Built-in order and subscription updates therefore do not run for a developer who follows the current UI alone.

This is a product onboarding/configuration defect described from the current code, not proof of widespread customer impact.

**Commercial evidence**

Backenly sells a hosted backend platform with a $25/month Pro plan and custom annual Enterprise contracts. The product includes PostgreSQL, REST APIs, event triggers and outbound webhooks. [Official pricing](https://backenly.com/pricing) · [Official product](https://backenly.com/).

**Stack evidenced**

PostgreSQL, REST API, backend functions, event triggers and outbound webhooks. The issue references the TypeScript/Next.js console and webhook route.

**Likely decision-maker**

Founder or product engineering lead.

**Tailored opening angle**

> Your Stripe card can show connected while every webhook is rejected because the signing secret is missing. I'd make the connection state reflect the full contract, expose the receiver URL, allow the signing secret to be configured independently, and add a setup smoke test that proves a signed event reaches the order/subscription handler.

**Next action**

Check whether #611 has a fix branch or release. If still open, offer a small integration-readiness sprint with UI, receiver and test-mode acceptance criteria.

**Sources:** [Issue #611](https://github.com/backenly/backenly/issues/611) · [Official pricing](https://backenly.com/pricing) · [Repository](https://github.com/backenly/backenly)

---

## 5. Elmo
**Score: 8.6/10 | Active**

**Observed signal**

Open issue [#936](https://github.com/elmohq/elmo/issues/936) says the web server sends no PostgreSQL query spans to Sentry in Cloud or white-label deployments. Sentry build-time instrumentation was disabled as a stopgap after enabling it caused a server-bundle crash involving `pg` and `pg-pool` module interop. The issue is an observability gap. It does not prove a current slow-query incident.

**Commercial evidence**

Elmo's official site says it's used by 200+ brands. Cloud pricing is public from $29 to $649/month, and the plans include API/MCP access. [Official site](https://www.elmohq.com/) · [Pricing](https://www.elmohq.com/pricing).

**Stack evidenced**

TypeScript, PostgreSQL, Drizzle, Sentry 11, Vite/TanStack Start, Nitro and Docker.

**Likely decision-maker**

Founder, CTO or engineering lead responsible for the Cloud runtime.

**Tailored opening angle**

> Your web server still has no PostgreSQL query spans in Sentry because build-time instrumentation is disabled after the pg/pg-pool bundling crash. I'd isolate the module-format issue, restore instrumentation in a production-style Docker build and prove query spans arrive from the actual server and admin paths.

**Next action**

Check for a Sentry or Vite upgrade and any internal branch. Keep the first sprint focused on web-server instrumentation, not the separate worker tracing path.

**Sources:** [Issue #936](https://github.com/elmohq/elmo/issues/936) · [Official pricing](https://www.elmohq.com/pricing) · [Official product](https://www.elmohq.com/)

---

## 6. ERPlora
**Score: 8.4/10 | Active**

**Observed signal**

Open issue [#284](https://github.com/ERPlora/saas/issues/284), opened 4 November, describes visible failures during short PostgreSQL interruptions caused by restarts, AWS maintenance or Blue/Green deployment. The issue explicitly says retries must be bounded and must never repeat a charge or invoice blindly.

The issue notes that the live-query broker already reconnects, but ordinary SaaS request paths do not yet handle transient database errors such as read-only transactions or admin shutdown. A related Hub issue is referenced, so shared retry semantics should be designed once rather than duplicated.

**Commercial evidence**

ERPlora sells a managed cloud ERP for small businesses. Public plans range from €29.99/month to €419.99/month per hub, with managed AWS infrastructure and replicated database backups. [Official pricing](https://erplora.com/pricing/) · [Official product](https://erplora.com/).

**Stack evidenced**

Python application code, PostgreSQL/psycopg error handling and AWS-managed database infrastructure. The exact framework is not assumed.

**Likely decision-maker**

Founder or engineering lead responsible for the SaaS and shared runtime.

**Tailored opening angle**

> I'd add bounded retry only where the operation is known not to have applied or is protected by an idempotency key. The acceptance suite should inject connection resets, read-only transactions and writer restarts, then prove that invoices and payments are never duplicated.

**Next action**

Check the linked Hub issue and current main branch for shared retry work. Confirm whether the owner wants an independent implementation sprint or a review of the planned internal change.

**Sources:** [Issue #284](https://github.com/ERPlora/saas/issues/284) · [Official pricing](https://erplora.com/pricing/) · [Official product](https://erplora.com/) · [Repository](https://github.com/ERPlora/saas)

---

## 7. Fivvi
**Score: 7.9/10 | Early-stage qualification**

**Observed signal**

Open issue [#466](https://github.com/fivvi-app/fivvi/issues/466) says a pilot gym will not switch until Fivvi supports memberships, credits, recurring payments and invoices. The issue states that Fivvi cannot currently take a payment. The proposed foundation is Mollie Connect for Platforms, with each gym acting as merchant, a local payment record created before the provider call, hosted checkout, webhook storage, provider-side status fetch and idempotent application of each state change. All preview environments are to use test mode; no real money before the agreed gate.

This is a launch-blocking feature scope, not a live payment incident.

**Commercial evidence**

The public repository describes Fivvi as scheduling, booking and payments software for personal trainers and small gyms. The issue names a pilot gym, but I did not find independently verifiable public pricing or evidence of a broader paying customer base. Budget remains unknown.

**Stack evidenced**

Web, iOS and Android product surfaces. Mollie Connect is the chosen provider in the issue. The wider backend stack was not independently verified, so it is not guessed.

**Likely decision-maker**

Founder or product/engineering owner.

**Tailored opening angle**

> The pilot is waiting on a real payment foundation, not just a checkout button. I'd implement the Mollie connection and payment state machine with a local payment record before provider calls, authoritative status fetches, idempotent webhooks and test-mode preview environments.

**Next action**

Qualify the pilot cutover date, funding and whether the owner is open to outside implementation. Do not quote a full sprint until those commercial points are clear.

**Sources:** [Issue #466](https://github.com/fivvi-app/fivvi/issues/466) · [Repository](https://github.com/fivvi-app/fivvi)

---

## 8. Cire / English Street Ventures
**Score: 7.6/10 | Early-stage qualification**

**Observed signal**

Open issue [#1996](https://github.com/englishstreetventures/osn/issues/1996) asks to let the same couple reuse one Stripe Connect Express account across multiple weddings. The current route creates an Express account per wedding, so a couple with two weddings can repeat identity and bank checks and split gift payouts between separate dashboards.

The issue also describes important security constraints: the browser must not be allowed to supply an arbitrary Stripe account ID; reuse must be backed by Cire's own record of which profile connected the account. Account-update and deauthorization webhooks must update every wedding using the account, while payout eligibility remains currency-specific per wedding.

**Commercial evidence**

The OSN repository README says Cire wedding invites and its organiser/vendor surfaces are live in production on Cloudflare at the Cire Weddings domain. The README describes guest invitations, RSVP, organiser and vendor portals. I did not find public Cire pricing in the reviewed sources.

**Stack evidenced**

TypeScript workspace packages, Cloudflare Workers/Pages, D1 migrations, Stripe Connect Express and a React organiser UI, based on the repository README and issue code references.

**Likely decision-maker**

Founder/product owner or engineering lead at English Street Ventures.

**Tailored opening angle**

> I'd make Stripe account reuse a controlled ownership operation, not a UI shortcut. The sprint would cover profile-to-connected-account proof, safe attach/detach, webhook fan-out across weddings and per-wedding currency eligibility tests.

**Next action**

Confirm whether the gift registry is being commercialised now and whether there is budget for external engineering. The technical scope is clear; willingness to pay is not.

**Sources:** [Issue #1996](https://github.com/englishstreetventures/osn/issues/1996) · [OSN repository and production status](https://github.com/englishstreetventures/osn) · [Cire Weddings](https://cireweddings.com)

---

## 9. TutorCruncher
**Score: 7.3/10 | Monitor only**

**Observed signal**

Open issue [#448](https://github.com/tutorcruncher/hermes/issues/448) describes duplicate Pipedrive organisations and inaccurate first-demo reporting. The issue says 55 deals had first demos on two organisations and 15 GB/ROW first demos in 2026 were double-counted. Sales had manually merged or corrected records. The issue is assigned internally, so it is not outreach-ready.

A separate open PR [#380](https://github.com/tutorcruncher/hermes/pull/380) notes that the sales-booking webhook path scans thousands of contact records to find a matching company, with caching or a normalized email index discussed as possible approaches.

**Commercial evidence**

TutorCruncher's official UK pricing starts at £25/month, with Startup at £60/month and Enterprise at £200/month. Enterprise includes REST API and custom integration support. The official API documentation describes authenticated API access and webhooks with delivery retries and logs. [Pricing](https://tutorcruncher.com/pricing/gb) · [API docs](https://api.tutorcruncher.com/) · [Webhook docs](https://help.tutorcruncher.com/en/articles/14182937-webhooks).

**Stack evidenced**

Pipedrive API, TutorCruncher API and webhooks. The Hermes issue is the source for the integration behaviour. Avoid assuming a database engine for this specific defect.

**Likely decision-maker**

Head of Engineering, integrations lead or engineering manager. Revenue Operations is a stakeholder.

**Tailored opening angle**

> Once the internal work is complete, I'd offer an independent data-integrity pass: idempotent organisation matching, normalized lookup keys, bounded webhook lookups and a safe backfill with reporting-parity tests.

**Next action**

Do not approach while the issue is internally assigned. Recheck #448 and PR #380 after the current team work lands.

**Sources:** [Issue #448](https://github.com/tutorcruncher/hermes/issues/448) · [PR #380](https://github.com/tutorcruncher/hermes/pull/380) · [Official pricing](https://tutorcruncher.com/pricing/gb) · [API docs](https://api.tutorcruncher.com/)

---

## 10. Lago
**Score: 7.0/10 | Monitor only, fixes in flight**

**Observed signal**

The two previously identified payment issues remain open, but the most important new finding is that maintainers have opened fixes:

- [PR #7020](https://github.com/getlago/lago-api/pull/7020) targets #6974 by retrying transient Flutterwave verification failures rather than silently ending the job.
- [PR #7023](https://github.com/getlago/lago-api/pull/7023) targets #6903 by treating Stripe 5xx responses as ambiguous, keeping the payment pending, retrying with the same idempotency key and linking the later success webhook to the original payment.

Both PRs were open and unmerged at the time checked on 5 November. The original defects are therefore not suitable for a cold pitch as though no fix exists.

**Commercial evidence**

Lago is an API-first subscription and usage-based billing platform with managed and self-hosted offerings, official SDKs and signed webhooks. [Developer resources](https://getlago.com/developers) · [Pricing](https://getlago.com/pricing).

**Stack evidenced**

Ruby/Rails, Stripe, Flutterwave and asynchronous payment jobs, from the issue and PR descriptions.

**Likely decision-maker**

Payments engineering lead, Head of Engineering or billing product engineering manager.

**Tailored opening angle**

> I saw the fixes for the Stripe ambiguous-result and Flutterwave retry paths are already in review. Once they land, I'd offer an independent regression and failure-injection pass across provider timeouts, duplicate delivery, retry exhaustion and reconciliation.

**Next action**

Monitor PR #7020 and #7023. Do not pitch the original bug fix while the maintainers are already implementing it.

**Sources:** [Issue #6903](https://github.com/getlago/lago-api/issues/6903) · [Issue #6974](https://github.com/getlago/lago-api/issues/6974) · [PR #7020](https://github.com/getlago/lago-api/pull/7020) · [PR #7023](https://github.com/getlago/lago-api/pull/7023) · [Official developer resources](https://getlago.com/developers)

---

## Exclusions and pipeline hygiene

- **NotaFácil:** the three issues previously tracked for Stripe endpoint configuration and quota accounting are closed. Do not pitch those original fixes as outstanding.
- **ZenUML for Confluence:** issue #1050 describes Stripe renewal events failing to extend a space licence, but the official Confluence pricing page says paid billing is managed through Atlassian Marketplace. The billing-surface mismatch needs clarification before treating it as a qualified lead.
- **Dreamport:** the current Stripe Connect work is a planned paid-Path marketplace build with fixed $8 purchases and a 15% platform share, but the repository appears to be in active founder-led implementation and the public commercial product/customer base wasn't verified. Keep as a watch candidate, not a qualified paid buyer.
- **Capabble:** the free-trial bypass issue was closed as completed on 4 November. Do not pitch the original bug.
- **Lago:** both original payment issues have open fix PRs, so monitor rather than pitch the fixes.
- **TutorCruncher:** internal ownership is visible on the open issue, so wait for the current work to settle.

## Top three and practical next actions

| Priority | Prospect | Why it leads | Next practical action |
|---:|---|---|---|
| 1 | Stigg | Highest visible commercial capacity and a precise, reproducible subscription API mismatch | Verify API ownership and whether an internal fix exists; prepare a preview/provision parity sprint |
| 2 | Postiz | Three related integration issues, public API/webhook plans and a clear customer-facing reliability story | Check maintainer activity, then scope token lifecycle plus channel-health API first; treat signing as an optional second workstream |
| 3 | Cloudroom | Founder-led buyer access, paid Ultra tier and a reproducible Windows ACP integration failure | Reproduce on the latest release and prepare a one-week provider-compatibility sprint |

**Secondary opportunity:** Backenly is worth moving into the top three if the team confirms #611 is still unresolved. It has a clear implementation boundary and direct relevance to DegenDev's webhook and integration work.

**Guardrails:** No one was contacted, no forms were submitted, no money was spent, no private data was accessed and no production systems were changed. Scores and buyer roles are research judgements, not verified purchasing intent.
