# MODEL AI — complete website package

A full white / blue / purple MODEL AI tools website package for `modelaitools.online`, with a dashboard, search, 34 dedicated tool routes, browser-side utilities, Firebase login/account pages, and Cloudflare Pages Functions for text chat, image generation, image analysis, and optional background removal.

## What is included

- `index.html` — responsive dashboard and tool directory.
- `tools/*/index.html` — 34 dedicated tool pages.
- `assets/app.js`, `assets/dashboard.js`, and styles — frontend UI and tool logic.
- `login.html`, `account.html`, `assets/firebase-auth.js` — email/password registration and login, Google sign-in, password reset, account display and sign-out.
- `assets/firebase-config.js` — Firebase web config populated using the values previously shown in your screenshot. Verify the values in Firebase Console before using the site.
- `functions/api/chat.js` — Groq text chat and Gemini image analysis proxy.
- `functions/api/image.js` — Gemini image generation proxy.
- `functions/api/background-remove.js` — optional background-removal provider route.
- `START-HERE.md`, `FIREBASE-SETUP.md`, `API-SETUP.md` — setup instructions.
- Legal/support pages, SEO files, and `404.html`.

## Quick deployment on Cloudflare Pages

1. Download and extract this ZIP on your computer.
2. Put the extracted contents directly in the root of the GitHub repository linked to the Cloudflare **Pages** project. The root must directly contain `index.html`, `assets/`, `tools/`, and `functions/`. Do not upload the ZIP as a single file.
3. Commit changes to the connected branch (commonly `main`).
4. Cloudflare → Workers & Pages → your Pages project → Deployments. Wait for a successful Production deployment.
5. Configure Firebase and provider secrets using the guide files below, then redeploy.

## AI provider setup

- Text chat and text-only AI tools use Groq. Configure `AI_API_KEY` as a Secret, `AI_API_BASE_URL` as a Text variable (`https://api.groq.com/openai/v1`), and `AI_CHAT_MODEL` as a Text variable (`openai/gpt-oss-120b`).
- Image analysis and image generation use Gemini. Configure `AI_IMAGE_API_KEY` as a Secret, `AI_IMAGE_API_BASE_URL` as a Text variable (`https://generativelanguage.googleapis.com/v1beta/openai`), `AI_IMAGE_MODEL` as a Text variable (`gemini-2.5-flash-image`), and `AI_VISION_MODEL` as a Text variable (`gemini-3.8-flash`).
- Background removal is optional and needs `BG_REMOVE_API_KEY` for the selected provider.

See `API-SETUP.md` for full instructions. Free quotas and model access are subject to current provider limits; image generation is not guaranteed to be free or unlimited.

## Firebase login

1. Firebase Console → Authentication → Sign-in method: enable Email/Password and Google.
2. Authentication → Settings → Authorized domains: add `modelaitools.online` and the actual Pages hostname (for example `modelaitools.pages.dev`).
3. Verify `assets/firebase-config.js` against Firebase Console → Project settings → Your apps.
4. Deploy, hard-refresh `/login.html`, and test Create an account / Google sign-in.

See `FIREBASE-SETUP.md`. The auth script binds the Create-account mode switch before loading Firebase and shows errors in the page if Firebase fails to load. This makes errors easier to identify but cannot override missing provider/domain settings.

## Important limits and security

- Browser-side tools such as calculators, text formatter, image resize/compress, QR generation, and some PDF tools can work without an AI API key. A subset of tools depends on external libraries/CDNs or provider API access.
- Provider-backed tools need valid Cloudflare Secrets and may enforce quotas or charges. This archive cannot create keys or verify paid/free entitlement in your accounts.
- Static checks (JavaScript syntax, route existence, archive integrity and local references) were run on this archive. Live sign-in and live AI requests could not be verified against your accounts from this environment.
- Never commit Groq/Gemini provider secrets or Firebase service-account private JSON to GitHub. Keep AI keys as Cloudflare encrypted Secrets.
- Before opening a public AI API to many visitors, set limits/abuse controls and monitor usage.
