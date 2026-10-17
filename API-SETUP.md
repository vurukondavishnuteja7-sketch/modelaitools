# MODEL AI API setup

## OpenRouter: text chat and image analysis
Create an API key at https://openrouter.ai/settings/keys, then add these variables to Cloudflare Pages → Settings → Variables and Secrets → Production:

- `AI_API_KEY` — **Secret**: your OpenRouter API key
- `AI_API_BASE_URL` — Text: `https://openrouter.ai/api/v1`
- `AI_CHAT_MODEL` — Text: `openrouter/free`
- `AI_VISION_MODEL` — Text: `openrouter/free` (actual free model must support vision for image analysis)

The free router uses models whose availability/capabilities and quota may vary. Free does not mean unlimited.

## Gemini: image generation
Create a Gemini key at https://aistudio.google.com/apikey, then add:

- `AI_IMAGE_API_KEY` — **Secret**: your Gemini API key
- `AI_IMAGE_API_BASE_URL` — Text: `https://generativelanguage.googleapis.com/v1beta/openai`
- `AI_IMAGE_MODEL` — Text: `gemini-2.5-flash-image`

Image-generation access, quota and pricing depend on the provider account; check your current plan.

## Security and deploy
Never paste keys into HTML/JavaScript or commit them to GitHub. Save Cloudflare settings then redeploy production. If the deployment fails, inspect Cloudflare deployment/build logs and the Network → `/api/chat` Response in the browser.
