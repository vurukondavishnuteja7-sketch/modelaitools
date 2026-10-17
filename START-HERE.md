# MODEL AI — Start here

## Deploy the complete site
1. Download and extract the full ZIP.
2. Copy/extract the ZIP contents to the root of your GitHub repository so `index.html`, `assets/`, `tools/`, and `functions/` are directly at the root.
3. Commit/push to the branch connected to Cloudflare Pages.
4. Wait for a successful production deployment.

## Then configure services
- Firebase login: follow `FIREBASE-SETUP.md`.
- AI chat, image analysis and image generation: follow `API-SETUP.md`.
- Background removal is optional and needs its own supported API key.

## Important limitations
- The public UI and API routes are included, but provider-backed tools cannot return real AI responses without valid Cloudflare secrets and provider access.
- Free tiers have limits and may change; image generation may be billed or unavailable on some accounts.
- No live end-to-end login/provider test has been run using your accounts from this archive. JavaScript syntax, route structure and file references are statically validated.
- Never commit a Groq/Gemini secret or Firebase service-account private JSON. Keep provider secrets in Cloudflare.
