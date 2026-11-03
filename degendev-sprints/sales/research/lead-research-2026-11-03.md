# DegenDev Sprint Lead Research
**Research date:** 3 November 2026  
**Scope:** Founder-led SaaS, digital products and membership businesses with public evidence of payment, subscription entitlement, webhook or integration reliability problems.

## Executive summary

The strongest opportunities this pass are:

1. **Lago**: reproducible payment-state defects where a successful Stripe charge can be treated as failed and charged again, plus a separate Flutterwave verification retry gap.
2. **Cloudroom**: a founder-led paid product with a fresh, reproducible ACP authentication failure on Windows and a separate cloud-agent crash-recovery problem.
3. **Stigg**: a subscription API mismatch where previewed billing-cycle behaviour differs from actual provisioning.

Scores are qualification scores, not closing probabilities. Public pricing proves a product has a commercial model, not that it has budget for DegenDev. Public issues may be external reports rather than confirmed production incidents.

## Ranked pipeline

| Rank | Prospect | Score | Fit | Primary signal |
|---:|---|---:|---|---|
| 1 | Lago | 9.5/10 | Strong B2B billing product | Ambiguous Stripe payment outcome can lead to a second charge |
| 2 | Cloudroom | 9.2/10 | Founder-led paid SaaS | Devin ACP authentication fails; cloud child recovery is unreliable |
| 3 | Stigg | 9.0/10 | Strong API monetization product | Subscription preview and provisioning disagree on billing-cycle anchor |
| 4 | OpenMeter by Kong | 8.2/10 | Enterprise/API product | Events can receive HTTP 204 and later be lost during Kafka outage |
| 5 | TutorCruncher | 7.9/10 | Established vertical SaaS | CRM sync defects corrupt first-demo reporting |
| 6 | Trigger.dev | 7.8/10 | Developer SaaS | Realtime append can return success after failure; stream chunks can be dropped |
| 7 | Chronote | 7.6/10 | Founder-scale subscription product | Stripe disputes are not reflected in paid access or renewal handling |
| 8 | Fider Cloud | 7.4/10 | Small hosted SaaS | Incomplete first subscription is not activated after later payment success |
| 9 | Voice Mate | 6.5/10 | Small recurring SaaS | Monitoring alerts on reconciliation/worker endpoints, but both returned HTTP 200 |
| 10 | CacheDrop | 6.1/10 | One-time digital product | First live purchase failed to issue a license; live-mode acceptance still underway |

---

## 1. Lago
**Qualification: 9.5/10 | Priority: Immediate**

**Observed pain**

Two open issues in the Lago API repository describe separate provider failure modes:

- [Issue #6903: Stripe 500 after a successful PaymentIntent can cause a second charge](https://github.com/getlago/lago-api/issues/6903). A Stripe HTTP 500 is treated as a failed payment even though the charge may have succeeded. The later `payment_intent.succeeded` webhook is not reconciled to the failed local payment. After the job lock expires, a retry can create a new PaymentIntent and charge the customer again. The issue includes a 3-of-3 reproduction in which a $50 invoice produced two successful $50 PaymentIntents.
- [Issue #6974: Flutterwave verification failure drops a paid event](https://github.com/getlago/lago-api/issues/6974). The webhook is acknowledged with HTTP 200 after enqueueing a job. A transient 429/503 or timeout from Flutterwave verification is converted to a nil result, the job completes successfully, and no retry remains. The invoice can stay pending even though the payment link was paid.

These are code-level reproductions in public issues. They are not proof that all Lago customers have been affected.

**Stack and API evidence**

Ruby/Rails payment services, Stripe and Flutterwave provider integrations, invoice/payment state, REST endpoints and asynchronous jobs are visible in the issue code paths. Lago's official product documentation describes REST APIs, official SDKs and signed webhooks, and its hosted Premium option alongside self-hosting: https://getlago.com/.

**Commercial evidence**

Lago markets a hosted billing product for subscriptions, usage-based, prepaid and hybrid pricing, and names companies including Mistral AI, CoreWeave and PayPal among its customers. Hosted pricing is sales-led rather than a simple public self-serve price.

**Likely decision-maker**

Head of Engineering, Payments/Integrations lead or product engineering manager responsible for payment-provider correctness.

**Tailored opening angle**

> I found two separate provider-outcome gaps. The Stripe path can treat an indeterminate 500 as a failed payment and later create a second charge, while the Flutterwave path can acknowledge a webhook before verification has succeeded and then lose the retry. I'd isolate the two state transitions, make provider outcomes recoverable and add deterministic regression tests around ambiguous responses, retries and reconciliation.

**Best bounded sprint**

Payment outcome correctness: Stripe ambiguous-result reconciliation, Flutterwave transient verification retry, durable event identity, and provider-specific replay tests. Keep the two providers as separately testable workstreams.

**Qualification caveats**

- The reports are external issue submissions. Maintainer acceptance and purchasing intent aren't established.
- Confirm no internal fix or branch is already underway before preparing a quote.
- This is the strongest technical fit, but buyer access and budget remain unverified.

**Sources:** [#6903](https://github.com/getlago/lago-api/issues/6903), [#6974](https://github.com/getlago/lago-api/issues/6974), [official Lago product/API overview](https://getlago.com/).

---

## 2. Cloudroom
**Qualification: 9.2/10 | Priority: Immediate**

**Observed pain**

Cloudroom has two open engineering signals:

- [Issue #106: Devin agent unusable on Windows](https://github.com/davidondrej/cloudroom/issues/106), opened 2 November. Devin's ACP adapter advertises a browser authentication method, but Cloudroom's auth-method resolver doesn't recognise it. The host never calls ACP `authenticate`, so `session/new` fails and the model picker remains empty. The reporter says they reproduced the failure with Devin CLI versions 3000.10.48 and 3000.11.234 and verified that explicitly authenticating through a raw JSON-RPC client allows the session to start.
- [Issue #66: cloud child recovery after OOM](https://github.com/davidondrej/cloudroom/issues/66). After a child harness is OOM-killed, the parent receives the same failure notice six times, the child remains in an unreachable/error state and cannot be restarted through the documented thread commands. The reporter says this can lead to replacement work being spawned while the original child's final state is uncertain.

**Stack and API evidence**

The public repositories describe a Rust cloud core, a TypeScript desktop/GUI layer and an HTTP API. Issue #106 identifies the TypeScript ACP bridge path. Cloudroom supports multiple agent harnesses, including Devin, Codex, Claude Code and Pi: https://github.com/davidondrej/cloudroom.

**Commercial evidence**

Cloudroom's official About page identifies David Ondrej as founder. Its published plans include Pro at $50/month, Super at $150/month and Ultra at $500/month. Early customers are described as sharing feedback directly with the team: https://www.cloudroom.dev/about and https://www.cloudroom.dev/docs/faq.

**Likely decision-maker**

Founder David Ondrej, or the engineering lead responsible for the ACP provider bridge and cloud session lifecycle.

**Tailored opening angle**

> I looked at the Devin ACP failure on Windows. The agent advertises a browser auth method, but the bridge doesn't resolve that method, so the host never authenticates before opening a session. I'd make the provider auth contract explicit, add a Windows regression harness and verify session creation, model discovery and recovery. The OOM child-recovery issue could be a separate follow-on sprint.

**Best bounded sprint**

ACP provider compatibility: method discovery, browser/PKCE authentication handoff, session creation, model discovery and Windows regression tests. Do not combine this with the OOM recovery work unless the founder wants a broader reliability sprint.

**Qualification caveats**

- The issues are public reproductions, not verified customer-wide incidents.
- Cloudroom is early-stage. Published plan pricing doesn't establish the number of paying customers or available contractor budget.
- The founder is identifiable, making buyer access more direct than most of this list.

**Sources:** [#106](https://github.com/davidondrej/cloudroom/issues/106), [#66](https://github.com/davidondrej/cloudroom/issues/66), [Cloudroom About](https://www.cloudroom.dev/about), [pricing/FAQ](https://www.cloudroom.dev/docs/faq), [repository](https://github.com/davidondrej/cloudroom).

---

## 3. Stigg
**Qualification: 9.0/10 | Priority: High**

**Observed pain**

[Issue #109](https://github.com/stiggio/stigg-typescript/issues/109), updated 1 November, documents a reproducible mismatch between subscription preview and actual provisioning.

When a customer changes from Basic to Pro with `billingCycleAnchor: 'NOW'`, the preview calculates an immediate reset and new renewal date, but the provisioned subscription keeps the old anchor and charges according to the unchanged period. The reporter says the behaviour appears across REST and several GraphQL provisioning entry points, using the standard Stripe sandbox integration.

The example shows the preview expecting a $13.67 immediate invoice and a 1 December renewal, while provisioning returns a $6.34 invoice and retains the 20 November renewal date.

This is an external sandbox report, not proof of a production billing incident.

**Stack and API evidence**

Stigg TypeScript SDK, REST and GraphQL subscription provisioning, preview APIs and Stripe sandbox integration are explicitly identified in the issue. Stigg publishes API/SDK documentation and a TypeScript SDK.

**Commercial evidence**

Stigg's published pricing lists a free Build tier and a Pro tier at $499/month monthly, with annual pricing discounted. The pricing page also describes Stripe integration, entitlements, usage events and webhooks: https://www.stigg.io/pricing.

**Likely decision-maker**

VP/Head of Product Engineering, subscription API lead or CTO responsible for provisioning semantics.

**Tailored opening angle**

> Your preview and provision paths appear to disagree when an immediate plan change requests a new billing-cycle anchor. I'd build a parity suite across REST, GraphQL and the TypeScript SDK, then test invoice amounts, period boundaries and recurring credit grants against the same subscription fixtures.

**Best bounded sprint**

Subscription preview/provision parity: reproduce the anchor mismatch, establish the intended contract, fix the authoritative API path and add cross-entrypoint regression tests.

**Qualification caveats**

- The report is from an external user in a sandbox.
- The issue was open when checked. Confirm whether Stigg has acknowledged or fixed it before pitching.
- The public Pro price is a commercial-fit signal, not proof of a DegenDev budget.

**Sources:** [Issue #109](https://github.com/stiggio/stigg-typescript/issues/109), [Stigg pricing](https://www.stigg.io/pricing), [Stigg SDK docs](https://node-sdk-docs.stigg.io/types/previewsubscription).

---

## 4. OpenMeter by Kong
**Qualification: 8.2/10 | Priority: High, enterprise route**

**Observed pain**

[Issue #5410](https://github.com/openmeterio/openmeter/issues/5410), opened 2 November, gives a detailed reproduction of event loss during a long Kafka outage.

The API returns HTTP 204 after queueing an event in the local Kafka producer, before the broker has durably accepted it. If the broker remains unavailable beyond the producer message timeout, the event delivery fails later and is only logged. The client has already received success and has no reason to retry. The reporter reproduced 9 of 9 lost events across three broker-outage runs and 9 of 9 with a broker topic-size refusal.

A related open issue, [#5409](https://github.com/openmeterio/openmeter/issues/5409), reports that deleting an invoice that was never synced to Stripe fails because the Stripe invoice ID is missing.

**Stack and API evidence**

Go, Kafka/librdkafka ingestion, CloudEvents, Stripe integration and the OpenMeter v1 API are identified in the issue. OpenMeter publishes REST APIs and typed SDKs: https://openmeter.io/docs/api.

**Commercial evidence**

OpenMeter powers Kong Konnect Metering & Billing. Kong's documentation labels the Metering & Billing plugin Enterprise-only and says it requires a separate purchase. Managed Konnect Metering & Billing customers use API v3: https://developer.konghq.com/plugins/metering-and-billing/ and https://openmeter.io/docs/api.

**Likely decision-maker**

Kong product engineering lead or engineering manager responsible for Metering & Billing and event ingestion.

**Tailored opening angle**

> I reviewed the 204-before-broker-acceptance reproduction. The ingestion contract currently lets clients believe an event is durable before Kafka confirms delivery, and the later failure is only logged. I'd make the acknowledgement boundary explicit, add durable retry/replay semantics and prove behaviour during broker outage, topic refusal and recovery.

**Best bounded sprint**

Event-ingestion durability: producer delivery acknowledgement, durable buffering or retry strategy, event identity, recovery observability and outage regression tests.

**Qualification caveats**

- This issue is on the open-source/legacy v1 API surface. Do not represent it as a confirmed defect in the managed Konnect API v3.
- Kong is a larger enterprise buyer, not a founder-led micro-SaaS. Procurement and vendor onboarding may be slower.
- Verify whether the issue is already assigned to an internal engineering team.

**Sources:** [#5410](https://github.com/openmeterio/openmeter/issues/5410), [#5409](https://github.com/openmeterio/openmeter/issues/5409), [API and SDK docs](https://openmeter.io/docs/api), [Kong plugin page](https://developer.konghq.com/plugins/metering-and-billing/).

---

## 5. TutorCruncher
**Qualification: 7.9/10 | Priority: Conditional**

**Observed pain**

- [Issue #448](https://github.com/tutorcruncher/hermes/issues/448) reports duplicate organisations and missing country data affecting first-demo reporting. The report says roughly 20% of GB/ROW first demos in the prior 12 months were North American prospects and 15 first demos in 2026 were counted twice. Sales manually corrected Pipedrive data.
- [Issue #456](https://github.com/tutorcruncher/hermes/issues/456) defines a guarded backfill for older booking-only organisations whose Country field wasn't populated by the newer sync logic.

Both issues remained open when checked. They are assigned internally, so this is not a cold claim that nobody is working on the problem.

**Stack and API evidence**

The Hermes repository documents Python/FastAPI, PostgreSQL, SQLModel/SQLAlchemy, Pipedrive API and TutorCruncher webhooks. TutorCruncher publishes an API and webhook documentation: https://api.tutorcruncher.com/.

**Commercial evidence**

TutorCruncher publishes UK plans from £25/month, Startup from £60/month and Enterprise from £200/month. Enterprise includes subscriptions and API/custom integration support: https://tutorcruncher.com/pricing/gb.

**Likely decision-maker**

CTO, Head of Engineering or integrations lead. Revenue Operations would be an important stakeholder because the reported defect affects sales reporting.

**Tailored opening angle**

> I'd focus on organisation identity and event ordering across the TutorCruncher-to-Pipedrive sync, then make the backfill safe to rerun and add analytics deduplication tests. The outcome is dependable first-demo reporting, not just a cleaner CRM table.

**Best bounded sprint**

CRM sync integrity: idempotent organisation matching, guarded backfill, event-order tests and reporting reconciliation.

**Qualification caveats**

- An internal engineer is assigned to both issues.
- The next step is to verify whether the remaining work is still blocking reliable reporting or whether they need independent acceptance testing.
- Don't pitch generic integration development when the company already sells technical support.

**Sources:** [#448](https://github.com/tutorcruncher/hermes/issues/448), [#456](https://github.com/tutorcruncher/hermes/issues/456), [TutorCruncher API docs](https://api.tutorcruncher.com/), [pricing](https://tutorcruncher.com/pricing/gb).

---

## 6. Trigger.dev
**Qualification: 7.8/10 | Priority: High technical fit**

**Observed pain**

Two open issues from late October identify realtime delivery semantics problems:

- [Issue #5067](https://github.com/triggerdotdev/trigger.dev/issues/5067): when the realtime append helper returns a rejected or failed result, the route only handles the unsupported-backend case. Other failures fall through and return HTTP 200 with `{ ok: true, seq: undefined }`.
- [Issue #5076](https://github.com/triggerdotdev/trigger.dev/issues/5076): `runs.subscribeToRun().withStreams()` aborts child stream subscriptions as soon as the upstream run-status stream closes, potentially dropping buffered or in-flight stream chunks emitted just before task completion.

An older open issue, [#4263](https://github.com/triggerdotdev/trigger.dev/issues/4263), reports 314 Sentry events affecting 7 users around realtime stream aborts after tab visibility changes. The issue says a separate polling fallback generally recovers captured generations.

**Stack and API evidence**

TypeScript/Node.js, Trigger.dev SDK and React hooks, realtime streaming and ElectricSQL client are identified in the issues. Trigger.dev documents durable webhooks and a public SDK/API: https://trigger.dev/product/webhooks.

**Commercial evidence**

Trigger.dev publishes Hobby at $10/month, Pro at $50/month and custom Enterprise pricing: https://trigger.dev/pricing.

**Likely decision-maker**

Realtime/API engineering lead, Head of Product Engineering or engineering manager.

**Tailored opening angle**

> I noticed the append route can acknowledge a rejected or failed write with HTTP 200, while the stream subscription can cancel child pipes before their final chunks drain. I'd define the delivery contract, make failure responses truthful and add deterministic tests for terminal status, in-flight chunks and backend rejection.

**Best bounded sprint**

Realtime delivery correctness: truthful append responses, stream-drain semantics, cancellation ownership and end-to-end regression tests.

**Qualification caveats**

- These are public issue reproductions. The newer reports don't establish a customer-wide incident.
- Trigger.dev is a larger developer platform, so a direct founder sale may be less likely than a team-level engineering engagement.

**Sources:** [#5067](https://github.com/triggerdotdev/trigger.dev/issues/5067), [#5076](https://github.com/triggerdotdev/trigger.dev/issues/5076), [#4263](https://github.com/triggerdotdev/trigger.dev/issues/4263), [pricing](https://trigger.dev/pricing), [webhook product docs](https://trigger.dev/product/webhooks).

---

## 7. Chronote
**Qualification: 7.6/10 | Priority: Conditional**

**Observed pain**

[Issue #469](https://github.com/Chronote-gg/Chronote/issues/469) says the application doesn't subscribe to or handle Stripe dispute and early-fraud-warning events. If a subscription invoice is disputed, the Discord server can retain its paid tier while Stripe continues renewing the subscription.

This creates a risk of further disputed renewals and fees. The issue is a documented missing event-handling path, not proof that a live chargeback has occurred.

**Stack and API evidence**

The public repository describes a Discord voice-recording and transcription bot with billing. The issue identifies TypeScript/Node and Stripe subscription webhook handlers.

**Commercial evidence**

Chronote's terms state that paid plans are billed through Stripe monthly or annually and renew automatically until cancelled. Its documentation lists introductory Basic pricing at $6/month for three months, then $10/month: https://docs.chronote.gg/legal/terms/ and https://docs.chronote.gg/features/.

**Likely decision-maker**

Founder or technical maintainer responsible for billing and Discord entitlement enforcement.

**Tailored opening angle**

> I'd add a dispute lifecycle through the existing Stripe webhook and server-entitlement paths, with idempotent event handling, operator alerts and tests for disputed, won and lost outcomes. The business policy for restoring access should stay explicit rather than being inferred in code.

**Best bounded sprint**

Stripe dispute and fraud-warning handling, entitlement state transitions, renewal policy tests and reconciliation.

**Qualification caveats**

- Low published ARPU may constrain external engineering budget.
- The issue is open, but customer impact and purchasing authority aren't verified.

**Sources:** [#469](https://github.com/Chronote-gg/Chronote/issues/469), [terms](https://docs.chronote.gg/legal/terms/), [features and pricing](https://docs.chronote.gg/features/), [repository](https://github.com/Chronote-gg/Chronote).

---

## 8. Fider Cloud
**Qualification: 7.4/10 | Priority: Conditional**

**Observed pain**

[Issue #1740](https://github.com/getfider/fider/issues/1740) reports a Stripe subscription created in `incomplete` state that is never activated when its first invoice is paid later.

The described flow creates the subscription during setup-mode Checkout. If the first off-session payment is declined or requires 3-D Secure, Fider returns HTTP 200 without persisting the incomplete subscription. When Stripe later reports successful payment, the relevant update/payment events don't activate the tenant. The tenant can remain on the free plan and the billing portal mapping can be missing.

**Stack and API evidence**

Go, PostgreSQL and Stripe are identified in the issue and Fider repository. The issue explicitly scopes the problem to Fider Cloud's Stripe billing path.

**Commercial evidence**

Fider's repository describes Fider Cloud as a fully managed service operated by the creators. Its official pricing page lists Pro at $25/month: https://github.com/getfider/fider and https://www.fider.io/pricing.

**Likely decision-maker**

Founder or engineering maintainer responsible for Fider Cloud billing.

**Tailored opening angle**

> I'd make the incomplete-to-active transition recoverable and idempotent, persist the Stripe customer/subscription mapping before entitlement changes, and add a reconciliation path for delayed first-invoice success and 3-D Secure completion.

**Best bounded sprint**

First-payment recovery: persist incomplete state, process later invoice success, restore entitlement and billing-portal access, and test delayed/duplicate event sequences.

**Qualification caveats**

- The issue is specific to Fider Cloud, not every self-hosted Fider installation.
- The hosted Pro price is modest. Qualify budget and current maintenance ownership before quoting.

**Sources:** [#1740](https://github.com/getfider/fider/issues/1740), [Fider repository](https://github.com/getfider/fider), [official pricing](https://www.fider.io/pricing).

---

## 9. Voice Mate
**Qualification: 6.5/10 | Watch closely, don't overstate**

**Observed signal**

The public status repository has two open monitoring alerts:

- [Issue #369](https://github.com/Voice-Mate/status-page/issues/369) marks the Stripe/Twilio/database reconciliation endpoint as down, but records HTTP 200 and a 6,102 ms response time.
- [Issue #365](https://github.com/Voice-Mate/status-page/issues/365) marks the background task queue/worker as down, but records HTTP 200 and a 490 ms response time.

These alerts may reflect a response-body or latency threshold problem rather than an actual service outage. The 200 responses mean we must not present this as a confirmed failure.

**Stack and API evidence**

The public integration documentation lists Google Calendar, Outlook, Slack, Telegram, Discord, HubSpot, Zapier, customer webhooks and custom API integrations. The actual internal framework/database stack isn't established by the sources checked, so none is assumed.

**Commercial evidence**

Voice Mate publishes $9.99 monthly and $74.99 annual subscriptions, with additional usage-based call fees. Its integration bundle is separately priced in its documentation: https://docs.voicemate.nl/pricing and https://docs.voicemate.nl/integrations/.

**Likely decision-maker**

Founder/product owner or technical lead responsible for integrations and the reconciliation service.

**Tailored opening angle**

> I noticed the status monitor is flagging the reconciliation and worker checks even though they return HTTP 200, with the reconciliation response taking about six seconds. I'd first establish whether this is a real latency/worker problem or a health-check false positive, then make the checks reflect actual dependency state and alert on actionable failures.

**Best bounded sprint**

Health-check and integration observability: dependency-aware readiness, queue heartbeat, Stripe/Twilio reconciliation timing, alert thresholds and a small failure-injection test.

**Qualification caveats**

- The monitoring issue does not prove an outage.
- The public docs are dated and pricing/integration details should be rechecked before outreach.
- This is a lower-confidence lead until a real service degradation is confirmed.

**Sources:** [#369](https://github.com/Voice-Mate/status-page/issues/369), [#365](https://github.com/Voice-Mate/status-page/issues/365), [pricing](https://docs.voicemate.nl/pricing), [integration catalogue](https://docs.voicemate.nl/integrations/), [webhook docs](https://docs.voicemate.nl/integrations/webhook).

---

## 10. CacheDrop
**Qualification: 6.1/10 | Digital product, low budget likelihood**

**Observed signal**

[Issue #76](https://github.com/Patrick-M-Bourget/cachedrop-website/issues/76) recorded the first live purchase on 1 November failing to issue a license because the production license function returned HTTP 503. The issue was closed on 2 November after work on logging the database error and accepting the newer Supabase secret-key format.

The parent [issue #591](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/591) defines the one-time licensing product: $29.99 base price, shown at $19.99, with subscriptions deferred. [Issue #652](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/652) remains open and documents the owner's live-mode setup, production key/deployment tasks and a real purchase/refund validation step.

**Stack and API evidence**

Stripe Payment Links, Stripe webhooks, Supabase Edge Functions, Supabase database RPC and Ed25519 license signing are described in the public issues.

**Likely decision-maker**

Solo founder/product maintainer.

**Tailored opening angle**

> I saw the first live purchase hit a license-issuance failure, and the follow-up live-mode checklist still includes a real purchase and refund test. Once your own fix is deployed, I'd offer an independent purchase-to-license acceptance pass covering webhook delivery, idempotent issuance, email delivery, key verification and refund revocation.

**Best bounded sprint**

Post-fix production acceptance: test-mode/live-mode separation, purchase-to-license verification, replay behaviour, email receipt and refund/revocation tests.

**Qualification caveats**

- The original issue is closed. Do not pitch the same fix again.
- The owner is already driving live-mode setup with an internal assistant, so this is only a possible independent QA offer.
- A $19.99 one-time product is unlikely to support a large engineering sprint. Keep any offer extremely small and fixed-price.

**Sources:** [#76](https://github.com/Patrick-M-Bourget/cachedrop-website/issues/76), [#591](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/591), [#652](https://github.com/Patrick-M-Bourget/mac-cleaner/issues/652).

---

## Pipeline hygiene and exclusions

- **UbuntuMedSpa #142:** a real paid online order remained pending because the Stripe webhook was disabled, and the buyer couldn't reach the booking calendar. This is a credible one-off rescue project, but it appears to be a service-business/implementation engagement rather than the target SaaS or digital-product ICP. Keep it as a separate agency-partner opportunity, not one of the ten core leads.
- **Engram #505:** the issue asks to become a Stripe Projects provider, but the provider protocol is not publicly documented. It fails the supported-public-API filter for now.
- **CacheDrop #76:** closed. Only post-fix acceptance testing remains a plausible offer.
- **Voice Mate:** status alerts returned HTTP 200. Treat the monitor result as an anomaly to investigate, not a confirmed outage.
- **TutorCruncher:** internal assignees are already present. Avoid duplicating work.
- **OpenMeter:** issue #5410 is specifically on the OSS/legacy v1 API surface. Don't claim the managed Konnect API v3 is affected.

## Top three and next practical action

### 1. Lago
**Next action:** check for maintainer acknowledgement and implementation activity on #6903 and #6974. If no fix is underway, prepare a narrow payment-outcome proposal with separate Stripe and Flutterwave acceptance criteria. This has the clearest financial consequence and strongest API fit.

### 2. Cloudroom
**Next action:** build a minimal ACP authentication reproduction for Devin on Windows against the latest release, then scope a one-week provider-compatibility sprint. The founder is publicly identifiable and the product has paid plans, making this the most accessible founder-led opportunity.

### 3. Stigg
**Next action:** turn #109 into a small deterministic parity harness covering preview versus provision across REST, GraphQL and TypeScript. Confirm the issue is still open and not already assigned to an internal fix before preparing a proposal.

## Operating guardrails

- No prospects contacted.
- No forms submitted.
- No money spent.
- No production systems accessed or changed.
- No inferred production incidents presented as confirmed.
- No stack claims made where the public evidence did not support them.
- Budget, procurement authority and willingness to use an external sprint remain unverified for every prospect.
