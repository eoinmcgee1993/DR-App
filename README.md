# SPIRIT404

A dark personal pattern system for reflective exploration of Human Design, astrology and recurring personal patterns.

## MVP
- Identity profile
- Visual bodygraph prototype
- Daily signals
- Oracle interface
- Local session state
- Netlify serverless Oracle endpoint
- Optional Hugging Face Qwen integration

## Oracle setup
Set HF_TOKEN as a Netlify environment variable. Without it, the app uses a safe local fallback response.

The frontend deliberately does not ask an LLM to calculate a Human Design chart. Production chart generation should use a deterministic chart/ephemeris engine, then pass structured results to the Oracle.

## Deploy
The project is static-first and configured for Netlify.
