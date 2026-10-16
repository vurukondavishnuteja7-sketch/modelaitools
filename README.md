# MODEL AI — Professional Static Website Starter

A responsive, white/purple/blue multi-tool website for `modelaitools.online`.

## Included
- 33 individual tool pages with page titles, descriptions, canonical URLs and FAQs.
- Search and category filtering on the home page.
- Working browser-side tools: marks/percentage calculator, weighted GPA, timetable draft, flashcards, date difference, case converter, browser text-to-speech, keyword hashtags, image compression/resizing/format conversion, color palette, QR code, image-to-PDF, PDF merge/split, JSON formatting, basic code indentation, prompt builder, and image prompt builder.
- API-ready AI interfaces for chat, image vision, quiz generation, translation, creator text, coding assistant and story/script generation. These return a transparent configuration message until the secure backend is configured.
- Cloudflare Pages Function at `functions/api/chat.js`, using an OpenAI-compatible Chat Completions API endpoint. The API key is read from a server-side secret, not from the browser.
- About, Contact, Privacy Policy, Terms, Disclaimer, HTML sitemap, XML sitemap, robots.txt and a non-fake ads.txt placeholder.

## Important
- This package does not include provider API keys and does not claim AI is live before setup.
- Image background removal is marked as requiring a dedicated external provider; it is not falsely simulated.
- The site owner must review legal/privacy pages, replace `hello@modelaitools.online` if needed, and add the real AdSense publisher entry only if/when approved.
- AdSense approval is not guaranteed. Google expects unique, useful content, clear navigation and compliance with current policies.

## Deploy to Cloudflare Pages via GitHub
1. Upload the contents of this folder to the root of the connected GitHub repository (`index.html` must be at repository root). The `functions/` folder must also be at the root.
2. In Cloudflare Pages, use production branch `main`, framework preset `None`, build command `exit 0`, and build output directory `.`.
3. Deploy and test the `*.pages.dev` preview before connecting `modelaitools.online`.
4. In Pages > Custom domains, connect `modelaitools.online`. If the domain is in the same Cloudflare account, follow the dashboard DNS prompts. Do not manually delete other DNS records before reviewing them.

## Enable AI securely
In Cloudflare Dashboard, open the Pages project > Settings > Variables and Secrets. Add these as server-side secrets/variables for production:
- `AI_API_BASE_URL` — base of an OpenAI-compatible API (for example a provider's `/v1` base URL; do not include `/chat/completions` at the end)
- `AI_API_KEY` — provider secret key; store as a secret, never commit it
- `AI_CHAT_MODEL` — model identifier supported by the selected provider, including vision support if using image analysis

After setting the secrets, trigger a new deployment or ensure the current deployment is updated, then test `/api/chat`. Provider URLs, model names, pricing and free quotas vary, so check the chosen provider's current official docs. A production service should add abuse protection, usage limits and a persistent rate limiter before public launch. Consider Cloudflare rate-limiting rules and per-user quotas before sharing widely.

## Local preview
Use VS Code Live Server or run a local static server from this folder. AI functions will not be available on a basic static-only local server unless you run Cloudflare Pages locally with Wrangler and configure local secrets.
