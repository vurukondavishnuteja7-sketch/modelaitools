# MODEL AI — API setup (Cloudflare Pages)

## Before you begin
- The browser-only tools (marks, GPA, case converter, prompt builder, image resize/compress, etc.) should work without any API key.
- AI Chat, image analysis, translator, quiz and creator-writing tools need a chat/vision model API.
- AI Image Generator needs an image model that your provider account is allowed to use.
- Background removal uses remove.bg and needs a separate key. It may have a limited free allowance and can be paid.
- Never paste keys into ChatGPT, HTML, frontend JS, or a public GitHub commit.

## A. Create a Gemini API key
1. Open https://aistudio.google.com/apikey and sign in to your Google account.
2. Create an API key for your own Google AI Studio project.
3. Do not share it in chat or upload it to GitHub.
4. Check the model's current quota/pricing in Google AI Studio before using it on a public website. Free access is limited and not guaranteed for every model.

Official Gemini OpenAI-compatible API guide: https://ai.google.dev/gemini-api/docs/openai

## B. Add secrets and variables to Cloudflare Pages
1. Open Cloudflare Dashboard → Workers & Pages → your **Pages** project `modelaitools`.
2. Open **Settings → Variables and Secrets** (the exact label may appear as Variables and Secrets under the Production environment).
3. Add these settings for **Production**:
   - `AI_API_KEY` — choose **Secret / Encrypt** and paste your Gemini API key.
   - `AI_API_BASE_URL` — plain text variable: `https://generativelanguage.googleapis.com/v1beta/openai`
   - `AI_CHAT_MODEL` — plain text variable: `gemini-3.8-flash`
   - `AI_IMAGE_MODEL` — plain text variable: `gemini-2.5-flash-image`
4. Save each setting. If Cloudflare asks for a new deployment, redeploy the latest commit.
5. Also configure Preview variables if you want the preview deployment to use AI.
6. Test `/tools/ai-chat/`, `/tools/image-analysis/`, then `/tools/ai-image-generator/`.

If the model name is unavailable to your project, use the exact model ID currently listed in Google AI Studio. Quotas, model availability, pricing and free-tier rules can change. Do not assume image generation is free or unlimited.

## C. Optional: background removal
1. Create an account and API key at https://www.remove.bg/api.
2. In the same Cloudflare Pages project's Production **Variables and Secrets**, add `BG_REMOVE_API_KEY` as an encrypted **Secret**.
3. Redeploy and test `/tools/background-remover/`.
4. Review remove.bg pricing and allowance first; it can incur costs.

## D. Firebase login (separate from AI API keys)
1. Open https://console.firebase.google.com/ and choose your Firebase project.
2. Authentication → Sign-in method: enable Email/Password and Google.
3. Authentication → Settings → Authorized domains: add `modelaitools.online` and `modelaitools.pages.dev`.
4. Project settings → General → Your apps → Web app: copy the web app config into `assets/firebase-config.js` in the GitHub repository.
5. Commit the config and wait for Cloudflare Pages to deploy.
6. Test `/login.html`, create an account, sign out, and test Google sign-in.
7. Firebase web config is intended for the client; do not upload Firebase service-account JSON or private Admin SDK credentials.

Official Firebase Google sign-in guide: https://firebase.google.com/docs/auth/web/google-signin

## E. Deploy and verify
1. Keep `index.html`, `assets/`, `tools/`, and `functions/` at the repository root.
2. Commit/push the changes to the connected GitHub `main` branch.
3. In Cloudflare Pages, confirm the latest deployment succeeds.
4. Browser-only smoke tests: Marks calculator, Case Converter, JSON formatter, image compressor, QR and PDF tools. QR/PDF libraries load from a CDN, so those need a working internet connection.
5. AI smoke tests: chat response, image upload analysis, image generation. If an API returns 401/403, check the key; 429 means quota/rate limit; 5xx may mean model/endpoint trouble.
6. Before allowing public use, configure Cloudflare rate limiting / abuse controls and monitor provider usage. This starter does not provide per-user billing or a complete abuse-prevention system.

## API variables summary

| Name | Type | Value |
|---|---|---|
| `AI_API_KEY` | Encrypted Secret | Your Gemini API key |
| `AI_API_BASE_URL` | Variable | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `AI_CHAT_MODEL` | Variable | `gemini-3.8-flash` |
| `AI_IMAGE_MODEL` | Variable | `gemini-2.5-flash-image` |
| `BG_REMOVE_API_KEY` | Encrypted Secret | Your remove.bg API key (optional) |
