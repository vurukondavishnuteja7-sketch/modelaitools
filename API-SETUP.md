# AI API Setup (read before enabling)

## Server-side secrets
Use Cloudflare Pages > your project > Settings > Variables and Secrets. Add `AI_API_BASE_URL`, `AI_API_KEY` (as a secret) and `AI_CHAT_MODEL` for the production environment. Do not add the provider key to `assets/app.js`, HTML files, GitHub commits or a public `.env` file.

The endpoint must implement OpenAI-compatible `POST {AI_API_BASE_URL}/chat/completions` with `Authorization: Bearer ...`, and the selected model must support your request type. Image analysis requires model/provider support for image input.

## Before sharing publicly
- Check provider pricing, free limits, acceptable-use terms, data retention and allowed model inputs.
- Configure Cloudflare rate limiting / abuse controls and usage caps. The included function validates request sizes and message counts but is not a complete per-user quota system.
- Test normal requests, invalid credentials, provider rate limits, large images and error responses.
- Add any consent and privacy disclosures required by your chosen provider and applicable laws.
