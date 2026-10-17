# MODEL AI — API setup (OpenRouter free chat + Gemini image generation)

This site uses Cloudflare Pages Functions. Keep API keys as encrypted Cloudflare Secrets; never put them in browser JavaScript or public GitHub files.

## 1. Free AI chat and image analysis — OpenRouter

1. Create/sign into an account at https://openrouter.ai/.
2. Create a key at https://openrouter.ai/settings/keys.
3. Open Cloudflare Dashboard → Workers & Pages → your `modelaitools` Pages project → Settings → Variables and Secrets. Add these in the **Production** environment:

| Variable | Type | Value |
|---|---|---|
| `AI_API_KEY` | Secret | Your OpenRouter API key |
| `AI_API_BASE_URL` | Text | `https://openrouter.ai/api/v1` |
| `AI_CHAT_MODEL` | Text | `openrouter/free` |
| `AI_VISION_MODEL` | Text | `openrouter/free` (optional; used for image understanding) |

The `openrouter/free` router automatically selects an available free model, and can accept text or images as input and return text. Because it may select different models over time, answer style/quality can vary. OpenRouter currently advertises 25+ free models on its Free plan, with a limit of 50 requests per day; individual providers/models can have additional limits or temporary unavailability. See https://openrouter.ai/pricing and https://openrouter.ai/openrouter/free.

## 2. AI Image Generation — separate service

The OpenRouter free-model router returns text; it does not create an image file. This website's image-generation route is configured for Google's Gemini OpenAI-compatible image endpoint. If you want to use image generation, create/verify a key at https://aistudio.google.com/apikey and add:

| Variable | Type | Value |
|---|---|---|
| `AI_IMAGE_API_KEY` | Secret | Your Gemini API key |
| `AI_IMAGE_API_BASE_URL` | Text | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `AI_IMAGE_MODEL` | Text | `gemini-2.5-flash-image` |

Image model availability, quota and billing depend on current Google AI Studio eligibility. Do not assume image generation is unlimited or always free. If you want a strictly zero-cost site, you can leave image-generation unconfigured; text chat and browser-based tools will still be available.

## 3. Optional background removal

Background removal requires `BG_REMOVE_API_KEY` and a compatible remove.bg account. This service can have separate usage limits or charges. Leave it unset if you do not want to use it.

## 4. Deploy and test

1. Replace the repository contents with the ZIP contents directly at the GitHub repository root, preserving `index.html`, `assets/`, `tools/`, and `functions/` as root-level paths. Do not upload only the ZIP file.
2. Commit/push to the branch connected to Cloudflare Pages.
3. Wait for the latest **Production deployment** to show **Success**.
4. In Cloudflare Settings → Variables and Secrets, verify the Production values above and redeploy if needed.
5. Open `https://modelaitools.online/api/chat`. A JSON health message confirms the GET route. A browser GET does not run the AI request; test `https://modelaitools.online/tools/ai-chat/` with a short prompt.

## Troubleshooting

- A Cloudflare-branded HTML 502 usually indicates a Cloudflare runtime/platform problem; open the matching Production deployment's Functions logs while reproducing the request.
- A JSON provider error includes `providerStatus` and `details` to help diagnose invalid API key, rate limits, model availability or request format.
- If production still serves old files, verify that Cloudflare Pages is connected to the repository and branch you edited. Direct Upload deployments may not build a `functions/` directory as expected; use Git integration or Wrangler.
- Never post API keys in screenshots or chats. Firebase's client web config is separate from provider API keys; never commit Firebase service-account private JSON.
