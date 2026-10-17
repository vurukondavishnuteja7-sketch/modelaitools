# MODEL AI — API setup (Groq chat + Gemini image/vision)

This website is deployed as a static site with Cloudflare Pages Functions. Do not paste private AI keys into GitHub or frontend JavaScript. Add them under Cloudflare Pages → Settings → Variables and Secrets, Production environment.

## Text chat (Groq)

Create a key at https://console.groq.com/keys. Then configure:

| Variable | Type | Value |
|---|---|---|
| `AI_API_KEY` | Secret | Your Groq API key |
| `AI_API_BASE_URL` | Text | `https://api.groq.com/openai/v1` |
| `AI_CHAT_MODEL` | Text | `openai/gpt-oss-120b` |

The code has these endpoint/model defaults, but setting them explicitly makes configuration easier to inspect. Groq availability, plan, rate limits and charges can change; check the account's current limits. Do not assume unlimited use.

## Image analysis and generation (Gemini)

Create/verify a key at https://aistudio.google.com/apikey. Add:

| Variable | Type | Value |
|---|---|---|
| `AI_IMAGE_API_KEY` | Secret | Your Gemini API key |
| `AI_IMAGE_API_BASE_URL` | Text | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `AI_IMAGE_MODEL` | Text | `gemini-2.5-flash-image` |
| `AI_VISION_MODEL` | Text | `gemini-3.8-flash` |

Image analysis routes through `/api/chat` but detects image input and uses the Gemini secret. Image generation uses `/api/image`. `AI_VISION_API_BASE_URL` is optional; if set, use `https://generativelanguage.googleapis.com/v1beta/openai`. Model availability, image output, quota and billing depend on Google AI Studio/account eligibility; not all image generation is free or unlimited.

## Optional background removal

The background remover requires a dedicated provider. `BG_REMOVE_API_KEY` is optional and only needed if you configure that service. Do not assume it works without the key and a valid provider account.

## Deploy carefully

1. Put the archive contents directly at the GitHub repository root, preserving `index.html`, `assets/`, `tools/`, and `functions/` as top-level paths. Do not upload only the ZIP file.
2. Commit changes on the branch linked to Cloudflare Pages.
3. In Cloudflare Pages → Deployments, check the latest Production deployment reaches Success.
4. Test `https://YOUR_DOMAIN/api/chat` in a browser. A JSON response `MODEL AI chat route is active` confirms the GET health route. A browser GET does not run chat; chat uses POST.
5. Test `/tools/ai-chat/` with a short prompt. Then test `/tools/image-analysis/` and `/tools/ai-image-generator/` after adding Gemini settings.

## Troubleshooting

- A Cloudflare-branded HTML 502 is a runtime/platform failure, not the provider's JSON error. Open the matching Production deployment → Functions logs while reproducing the issue.
- A JSON provider error includes `providerStatus` and `details` to help identify invalid credentials, unsupported model, quota or request-format issues. Keep API keys private when sharing screenshots.
- If deployments keep serving old files, verify the Git-connected Pages project is deploying the repository/branch you updated and that `functions/api/chat.js` is at the repository root path shown above. Direct Upload deployments may not build a `functions/` directory as expected; use Git integration or Wrangler.
