# AI API setup (server-side only)

The included `functions/api/chat.js` is a small OpenAI-compatible proxy for Cloudflare Pages Functions. It supports text and image-message payloads, basic message/body limits and returns a clear 503 when secrets are missing.

## Secrets

In Cloudflare Dashboard → Workers & Pages → your **Pages** project → Settings → Variables and Secrets, add these as **secrets** / protected values where supported:

- `AI_API_BASE_URL` — the provider's OpenAI-compatible API base (without `/chat/completions`).
- `AI_API_KEY` — your real private API key. Never put it in browser code or GitHub.
- `AI_CHAT_MODEL` — a model name available to your provider; for image attachments it must support vision.

Example values are provider-specific. Do not copy example URLs or model IDs from random tutorials without checking the provider's official documentation and your account's access. Save and redeploy after setting secrets.

## Test

1. Open `/tools/ai-chat/` or use the right-side home assistant.
2. Ask a small non-sensitive question.
3. If you see a provider/model/quota error, confirm base URL, model ID, available quota and provider requirements.
4. For image analysis, pick a small PNG/JPEG/WebP and send it only if you accept the provider's privacy/retention terms.

## Features requiring a separate integration

- Image generation: implement a dedicated server-side `POST /api/image` against a provider's official image-generation API; validate dimensions/prompt, limit costs, and return an image URL/blob. Do not route image prompts to text chat and claim an image was generated.
- Background removal: use a dedicated segmentation/background-removal provider/server route; review file retention and per-image cost.
- Login and Google OAuth: add a real auth system and protect user data; do not infer that a profile badge is authentication.

## Before public launch

Add rate limits per IP/user, request timeouts, stricter file validation, observability, privacy disclosures for provider processing, and a cost cap. The starter has size/count guardrails but it is not a complete abuse-prevention system.
