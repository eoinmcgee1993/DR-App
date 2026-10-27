# DegenDev Engineering Sprints

Static, responsive landing page for fixed-scope backend reliability and integration services.

## Contents
- `index.html`: responsive landing page with dark/light mode, package cards, process and copyable project-scoping brief.
- No customer information is submitted or stored by the page.
- Prices shown are starting fee assumptions, subject to scoping.

## Local preview
Open `index.html` in a browser.

## Deployment
Vercel project: `degendev-sprints`.
Production branch and Git integration must be configured in Vercel to enable push-to-deploy. Netlify can be connected separately if a Netlify deployment is desired; do not configure two competing production sources on the same domain without an explicit choice.

## Production readiness checklist
- [ ] Configure business contact email or a secure intake endpoint.
- [ ] Configure invoicing and payment provider in test mode first.
- [ ] Add privacy notice and terms appropriate to the business.
- [ ] Configure Git-based deployment and CI validation.
- [ ] Verify domain ownership and production access settings.
- [ ] Test mobile, accessibility, theme toggle and clipboard behavior.

No credentials or secrets belong in this repository or frontend code.