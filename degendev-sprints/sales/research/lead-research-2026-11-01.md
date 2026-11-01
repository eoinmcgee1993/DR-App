# DegenDev Sprint Lead Research
## 1 November 2026

Research pass for fixed-scope engineering sprints. This is a fresh list, not a reprint of the 30–31 October pipeline.

### Qualification method

Scores are commercial qualification scores, not close probabilities. I weighted:
- commercial model and evidence of paid product: 30%
- specificity and recency of the engineering signal: 30%
- API / integration fit for a bounded sprint: 20%
- evidence freshness: 10%
- likely buyer access: 10%

GitHub issue state and issue text were checked on 1 November 2026. Where the public record is a test gap, feature plan, or unacknowledged report rather than a verified production incident, that distinction is called out. No prospects were contacted.

## Ranked leads

| Rank | Prospect | Score | Status | Best sprint angle |
|---:|---|---:|---|---|
| 1 | CallCaster | 9.3 | Strong | Payment-credit integrity and signed customer webhook delivery |
| 2 | TutorCruncher | 8.8 | Strong | Pipedrive sync and CRM data-integrity hardening |
| 3 | Chronote | 8.6 | Strong | Stripe dispute lifecycle and webhook contract verification |
| 4 | MyTradingCoach | 8.5 | Strong | 3DS subscription-state acceptance and recovery tests |
| 5 | Engram | 8.2 | Strong | Paddle refund / scheduled-cancellation correctness |
| 6 | Fider Cloud | 8.0 | Strong | Incomplete first-payment recovery and entitlement activation |
| 7 | MindRoom | 7.8 | Good | Stripe price-change correctness and revenue reporting |
| 8 | Spree Commerce | 7.5 | Good | Absolute webhook URL generation and gateway registration tests |
| 9 | Wazoo | 6.4 | Conditional | Per-namespace metering and paid-tier enforcement |
| 10 | Publira | 5.9 | Conditional | Subscription invoice ledger and royalty allocation |

---

### 1. CallCaster
**Score: 9.3/10 | Strong commercial and technical fit**

**Commercial evidence:** CallCaster publishes a prepaid credit model at CAD $0.02 per credit, with a minimum purchase of 500 credits ($10). It sells calling, SMS and IVR usage and exposes a public integrator API.

**Observed pain:**
- Open issue #2920 documents a sandbox reproduction where Stripe Checkout metadata is trusted for workspace and credit amount without reconciling those values against the actual collected amount, currency, customer and workspace relationship. The issue records a local reproduction, not evidence of exploitation or customer loss.
- Open issue #3054 says outbound customer webhooks have no server-generated signature or stable event ID, making origin verification and reliable deduplication difficult for receivers.

**Stack evidenced:** React Router 8, Bun, Railway PostgreSQL, Drizzle ORM, S3-compatible storage, Twilio, Stripe and Resend.

**Likely decision-maker:** Founder/CTO or engineering lead responsible for payments and the public integrator API. Formal title and budget are unverified.

**Opening angle:** Offer a payment-integrity sprint that reconciles Stripe session amount/currency/customer/workspace before crediting the ledger, then adds a versioned HMAC-signed outbound webhook envelope with stable event IDs, immutable retry payloads and receiver fixtures. Keep existing consumers compatible through an opt-in cutover.

**Qualification note:** Both issues are open and had no comments when checked. The sandbox reproduction is strong technical evidence, but it is not proof of a production exploit.

Sources:
- [Issue #2920: Stripe webhook credit-grant validation](https://github.com/chester-hill-solutions/callcaster/issues/2920)
- [Issue #3054: customer webhook envelope](https://github.com/chester-hill-solutions/callcaster/issues/3054)
- [CallCaster repository and documented stack](https://github.com/chester-hill-solutions/callcaster)
- [Official CallCaster pricing](https://callcaster.ca/pricing)

### 2. TutorCruncher
**Score: 8.8/10 | Established paid SaaS, clear integration work**

**Commercial evidence:** TutorCruncher publishes paid plans starting at £25/month in the UK, with higher Startup and Enterprise tiers. Its US pricing page lists $30, $80 and $240 starting prices. The Enterprise tier includes subscriptions, API and custom integrations.

**Observed pain:** Open issue #448 records CRM/reporting data integrity problems in the TutorCruncher-to-Hermes-to-Pipedrive flow. The issue reports 55 deals with first demos duplicated across two Pipedrive organisations, with 15 GB/ROW first demos double-counted in 2026. Sales manually corrected some records, but the issue says the underlying causes could recur. Follow-up issue #456, opened 29 October, specifies a guarded backfill for booking-only companies whose country field was not populated by the later sync change.

**Stack evidenced for the integration service:** Python 3.12+, FastAPI, PostgreSQL, SQLModel/SQLAlchemy, Alembic, Pipedrive API and TutorCruncher webhooks.

**Likely decision-maker:** Head of Engineering, engineering manager or technical owner of the Hermes/CRM integration. Revenue Operations may be a stakeholder, but not assumed to own engineering budget.

**Opening angle:** A CRM data-integrity sprint covering duplicate organisation prevention, webhook/sync invariants, safe country-field backfill, idempotent reconciliation and regression tests for booking-first versus signup-first flows.

**Qualification note:** This is an internal sales integration rather than a customer-facing billing defect. The commercial fit is strong, but the current owner and whether the backfill is already underway need checking.

Sources:
- [Issue #448: first-demo reporting and duplicate organisations](https://github.com/tutorcruncher/hermes/issues/448)
- [Issue #456: country-field backfill](https://github.com/tutorcruncher/hermes/issues/456)
- [Hermes integration architecture and stack](https://github.com/tutorcruncher/hermes)
- [Official UK pricing](https://tutorcruncher.com/pricing/gb)
- [TutorCruncher API documentation](https://api.tutorcruncher.com/)

### 3. Chronote
**Score: 8.6/10 | Direct Stripe subscription lifecycle fit**

**Commercial evidence:** Chronote is a hosted Discord meeting-recording and notes product. Its terms state that paid server plans are billed through Stripe monthly or annually, renew automatically, and enforce plan limits. Its documentation describes Basic introductory pricing of $6/month for three months, then $10/month, with annual billing also available.

**Observed pain:**
- Open issue #469 says charge disputes and early fraud warnings are not handled. The current subscription reconciliation treats active, trialing and past_due as paid, and only downgrades on cancellation or incomplete expiry. A dispute therefore doesn't currently stop paid access or future renewals.
- Open issue #468 records a production endpoint event-list mismatch and Stripe API-version drift. The issue says the production endpoint appeared not to deliver checkout.session.expired, and the sandbox endpoint subscribed to seven of eight events handled by the code.

**Stack evidenced:** TypeScript/Node.js, Stripe, AWS ECS, DynamoDB and a Vite/Mantine frontend, as documented in the repository.

**Likely decision-maker:** Founder/technical maintainer or engineering lead for billing and subscription services.

**Opening angle:** A Stripe event-contract sprint: make the required event list and API version machine-checkable, add a read-only endpoint audit, handle disputes idempotently through the existing receipt/reconciliation path, and test that disputed subscriptions cannot retain paid access or continue renewing.

**Qualification note:** Both issues are open and had no comments when checked. The missing dispute handler is a code-level gap described by the issue; don't claim a confirmed chargeback incident without maintainer confirmation.

Sources:
- [Issue #469: Stripe disputes and paid entitlements](https://github.com/Chronote-gg/Chronote/issues/469)
- [Issue #468: webhook event list and API-version drift](https://github.com/Chronote-gg/Chronote/issues/468)
- [Chronote repository and stack](https://github.com/Chronote-gg/Chronote)
- [Official terms: Stripe billing and plan limits](https://docs.chronote.gg/legal/terms/)
- [Features and billing documentation](https://docs.chronote.gg/features/)

### 4. MyTradingCoach
**Score: 8.5/10 | Paid subscription product, strong founder fit**

**Commercial evidence:** MyTradingCoach publishes a free tier, Premium at €49/month or €490/year, and a founder offer of €29/month or €290/year. The site says the founder offer is closed and Premium remains available. It connects to Tradovate read-only and supports CSV imports from several brokers.

**Observed pain:** Open issue #819, created 31 October during beta acceptance testing, identifies missing coverage for the 3-D Secure payment lifecycle:
- A past_due subscription update should move Premium access to FREE while payment authentication is pending.
- After successful authentication and payment, Premium and founder reservation state should be restored correctly.
- The issue says the full 3DS scenario could not be completed in the Stripe dashboard, so this is a test-coverage gap, not a confirmed customer-facing failure.

**Stack evidenced:** Angular 22, NestJS 11, Prisma 7, PostgreSQL, Redis, Stripe and Tradovate integration.

**Likely decision-maker:** Founder/product owner and technical lead. The public site and repository indicate a compact owner-led product, but budget is unverified.

**Opening angle:** A two-to-four-day subscription acceptance sprint around 3DS required-action, past_due access, invoice.paid recovery, founder reservation persistence, email deduplication and end-to-end Stripe test-clock coverage.

Sources:
- [Issue #819: 3DS and Premium recovery test gaps](https://github.com/kyoshiroDev/my-trading-coach/issues/819)
- [MyTradingCoach repository and stack](https://github.com/kyoshiroDev/my-trading-coach)
- [Official product and pricing](https://www.mytradingcoach.app/)

### 5. Engram
**Score: 8.2/10 | Direct Paddle subscription correctness**

**Commercial evidence:** Engram sells hosted note sync and AI-memory access. Its public pricing lists Starter at $7/month and Pro at $14/month, with annual options and Paddle handling localized tax.

**Observed pain:** Open issue #2220 says a full refund on a subscription that already has a scheduled change, such as cancellation at period end, causes Paddle to reject the immediate cancellation with subscription_locked_pending_changes. Retrying alone doesn't fix it, so the buyer can retain access until the scheduled period-end cancellation. The proposed correction is to clear the scheduled change before cancelling.

The issue also flags a related data-model risk: one local subscription row per user cannot distinguish two live Paddle subscriptions for the same user.

**Stack evidenced:** Elixir 1.15+, Phoenix, hosted MCP/REST service and Paddle.

**Likely decision-maker:** Founder/technical maintainer.

**Opening angle:** A Paddle lifecycle sprint covering scheduled-change clearing, immediate refund cancellation, multiple-subscription identity, idempotent webhook handling and sandbox tests for refund/cancel ordering.

**Qualification note:** The issue is open and had no comments when checked. Confirm whether a fix is already in a private branch before quoting.

Sources:
- [Issue #2220: refund with scheduled cancellation](https://github.com/engram-app/Engram/issues/2220)
- [Engram repository and stack](https://github.com/engram-app/Engram)
- [Official Engram pricing](https://engram.page/pricing)

### 6. Fider Cloud
**Score: 8.0/10 | Clear paid-access failure mode**

**Commercial evidence:** Fider Cloud offers a free hosted tier and a $25/month Pro plan. Self-hosted Fider is free. Its public positioning is a feedback portal for SaaS, mobile-app and game-development teams.

**Observed pain:** Open issue #1740 describes a Stripe setup-mode Checkout flow where a subscription created as incomplete is not persisted. If the first off-session payment later succeeds, the customer.subscription.updated and invoice.paid events are acknowledged without activation. The tenant remains on the free plan, the billing portal cannot be opened for that subscription, and upgrading again can create a second customer and subscription.

**Stack evidenced:** Go, PostgreSQL (lib/pq) and Stripe Go SDK.

**Likely decision-maker:** Fider Cloud founder or engineering maintainer responsible for the hosted billing path.

**Opening angle:** A bounded first-payment recovery sprint: persist the incomplete subscription/customer mapping, process later invoice-paid and subscription-active events idempotently, and test 3DS/decline/retry/recovery/portal access.

**Qualification note:** The issue is open but had no comments when checked. The reporter explicitly says frequency hasn't been measured, so don't claim a known volume of affected customers.

Sources:
- [Issue #1740: incomplete subscription never activated after later payment](https://github.com/getfider/fider/issues/1740)
- [Fider repository and stack](https://github.com/getfider/fider)
- [Official Fider pricing](https://www.fider.io/pricing)

### 7. MindRoom
**Score: 7.8/10 | Good fit, billing presentation and reporting correctness**

**Commercial evidence:** MindRoom offers hosted plans at $10/month (bring your own model keys), $20/month Hobby with included AI credit, and $200/month Pro. It also supports self-hosting.

**Observed pain:** New open issue #3521, created 1 November, records three pre-existing pricing defects:
- Stripe prices are displayed rounded to whole dollars while checkout bills cents.
- The admin MRR estimate truncates the same values.
- After a price change, existing subscribers can see today's YAML price instead of their actual Stripe price, and yearly subscribers are shown a monthly figure. The admin revenue estimate uses current tier pricing rather than each subscriber's actual price.

**Stack evidenced:** Python 3.13+ / FastAPI backend, Next.js 16 / React 19 frontend, Stripe, Supabase and generated OpenAPI types.

**Likely decision-maker:** Founder or platform engineering lead.

**Opening angle:** A pricing-source-of-truth sprint that reads actual subscription/price data for existing subscribers, handles monthly versus annual presentation, preserves grandfathered prices and calculates MRR in cents from billable subscription state.

**Qualification note:** The issue was opened today and had no comments when checked. The problem is pricing and revenue accuracy, not evidence that Stripe is charging the wrong amount.

Sources:
- [Issue #3521: SaaS pricing display and price changes](https://github.com/mindroom-ai/mindroom/issues/3521)
- [MindRoom repository](https://github.com/mindroom-ai/mindroom)
- [Official hosted plans](https://app.mindroom.chat/)

### 8. Spree Commerce
**Score: 7.5/10 | Enterprise platform, small but concrete gateway defect**

**Commercial evidence:** Spree is an open-source commerce platform used by 5,000+ businesses, with a commercial Enterprise Edition and managed private-cloud/support options. It supports REST APIs, subscriptions, digital products and payment-provider integrations.

**Observed pain:** New open issue #15048, created 31 October, says PaymentMethod webhook_url can be generated without a URL scheme when a store URL is stored as a bare host. The bundled Stripe gateway uses that value when registering webhooks. Existing tests compare the same incorrectly constructed string, so they don't catch the missing scheme.

**Stack evidenced:** Ruby/Rails commerce application, Stripe provider integration and REST API. Do not assume a specific database or cache from this issue.

**Likely decision-maker:** Engineering lead or maintainer for payment providers; Enterprise product/engineering lead for commercial support work.

**Opening angle:** A small gateway-correctness sprint: normalize webhook URLs using the existing formatted store URL method, add absolute-URL/HTTPS assertions and test Stripe registration for bare-host, custom-domain and development URLs.

**Qualification note:** This may be too small to sell as a standalone full sprint. Bundle it with a broader payment-provider registration and webhook-contract regression pass. The core is free/open source; paid buyer fit is the Enterprise team.

Sources:
- [Issue #15048: webhook URL missing scheme](https://github.com/spree/spree/issues/15048)
- [Spree repository](https://github.com/spree/spree)
- [Official Spree Commerce site](https://spreecommerce.org/)
- [Enterprise Edition and managed support](https://spreecommerce.org/enterprise/)

### 9. Wazoo
**Score: 6.4/10 | Conditional, private beta**

**Commercial evidence:** Wazoo describes itself as a world-models-as-a-service platform for AI agents. Its public site says it is in private beta and access is manually approved. No public paid pricing was found.

**Observed pain:** Open issue #156 defines the gap between a shared daily Cloudflare D1 write budget and per-customer/namespace usage limits. The issue cites a 25 October outage where one shared free-tier quota affected every customer. It says there is currently no namespace-to-owner or namespace-to-Stripe-customer mapping, and the owner still needs to decide paid tiers, included usage, overage and failed-payment/cancellation policy.

**Stack evidenced:** TypeScript/Cloudflare Workers, Cloudflare D1 data plane, generated HTTP SDKs and a separate platform control plane. Stripe is proposed, not yet wired into this issue's described flow.

**Likely decision-maker:** Founder/technical lead for the platform control plane and data plane.

**Opening angle:** First sell a metering/entitlement design sprint, not a full billing build: per-namespace plan limits, usage API, owner/customer mapping and deterministic limit tests. Add Stripe Checkout and webhook lifecycle only after pricing and failed-payment policies are approved.

**Qualification note:** No published prices and unresolved owner decisions make this nurture-only. Don't quote a complete billing sprint before the commercial model exists.

Sources:
- [Issue #156: per-namespace plan tiers and Stripe billing](https://github.com/wazootech/worlds-api/issues/156)
- [Worlds API repository and architecture](https://github.com/wazootech/worlds-api)
- [Official Wazoo private-beta site](https://wazoo.dev/)

### 10. Publira
**Score: 5.9/10 | Conditional, pre-production**

**Commercial evidence:** Publira describes itself as a multi-tenant SaaS for manga publishers, with branded reader sites, mobile apps, paid episodes and monthly royalty statements. Its site explicitly says v0.5.0 is still under active development and is not ready for production use.

**Observed pain:** Open issues #5011 and #5016 describe subscription revenue missing from the publisher's Revenue view and author royalty statements. The existing Stripe subscription flow re-reads subscription state but doesn't persist each paid invoice. The proposed work adds an idempotent invoice.paid payment record, refund accounting, revenue/CSV reporting and allocation of subscription income to authors based on what readers consumed.

**Stack evidenced:** Three Next.js applications, Go server/worker, Flutter mobile client, PostgreSQL with row-level security, Redis, Stripe and PAY.JP.

**Likely decision-maker:** Founder/product architect or technical maintainer.

**Opening angle:** A bounded subscription-accounting sprint with an invoice ledger keyed by Stripe invoice ID, refund handling, RLS-safe tenant attribution, revenue reporting and deterministic royalty-statement tests.

**Qualification note:** Strong technical fit, weak immediate commercial qualification because the product site says it isn't production-ready. Treat this as a potential implementation partner, not a near-term revenue lead.

Sources:
- [Issue #5011: subscription payments missing from revenue and royalties](https://github.com/publira/publira/issues/5011)
- [Issue #5016: persist paid invoices and allocate royalties](https://github.com/publira/publira/issues/5016)
- [Publira repository](https://github.com/publira/publira)
- [Official Publira product and production-readiness statement](https://www.publira.dev/)

---

## Top three and next practical action

### 1. CallCaster
Recheck whether #2920 or #3054 has a fix in a branch or recent commit. If not, prepare a narrow proposal with two acceptance gates: no credit ledger entry unless the Stripe session's actual amount/currency/customer/workspace match, and every customer webhook has a stable event ID plus a verifiable signature. This is the strongest direct fit because the product has a public credit model, API and PostgreSQL-backed integration surface.

### 2. TutorCruncher
Recheck the implementation of #450 and the backfill plan in #456, then verify whether #448's duplicate-organisation and first-demo reporting problems are still recurring. Prepare a CRM integration data-integrity sprint only if the current sync/backfill work hasn't already resolved the issue.

### 3. Chronote
Check recent commits against #468 and #469. The most commercially useful offer is a Stripe webhook contract and dispute-lifecycle sprint: endpoint event list/version audit, idempotent dispute handling, and tests proving that a disputed subscription can't keep renewing or retaining paid access.

## Watchlist / exclusions

- **Knegarloggen:** three related micro-SaaS apps have Stripe test-mode billing and an open decision about one shared Stripe account versus separate accounts. The live-mode cutover is not complete. This is pre-launch setup, not a confirmed defect, so it isn't counted among the ten.
- **Tapstate Cloud:** its open billing issue describes live self-serve Stripe subscribers, but the current public product site says Tapstate Cloud is coming soon. Reconcile that product/status mismatch before treating it as an active buyer.
- **Open Artifacts:** public terms say paid plans aren't on sale yet and billing terms will be added before charging. Not a paid-client lead today.
- **Publira and Wazoo:** retained as conditional because the engineering signals are clear, but their public commercial readiness is weak.

No prospect was contacted, no form was submitted, no money was spent, and no production system was changed.
