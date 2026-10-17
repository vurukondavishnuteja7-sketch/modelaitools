// MODEL AI image-generation endpoint for Cloudflare Pages Functions.
// Keep image generation credentials separate from the OpenRouter chat credentials.
const DEFAULT_GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai";
const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
function json(status, data) {
  return new Response(JSON.stringify(data), { status, headers: HEADERS });
}

export async function onRequestPost({ request, env }) {
  try {
    const apiKey = String(env?.AI_IMAGE_API_KEY || "").trim();
    if (!apiKey) {
      return json(503, { error: "Image generation needs AI_IMAGE_API_KEY as an encrypted Cloudflare Secret containing your Gemini API key." });
    }

    let body;
    try { body = await request.json(); }
    catch { return json(400, { error: "Request body is not valid JSON." }); }

    const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
    const style = typeof body?.style === "string" ? body.style.slice(0, 80) : "Realistic";
    const ratio = ["1:1", "16:9", "9:16", "4:3"].includes(body?.ratio) ? body.ratio : "1:1";
    if (!prompt || prompt.length > 3000) return json(400, { error: "Enter an image prompt under 3,000 characters." });

    const base = String(env?.AI_IMAGE_API_BASE_URL || DEFAULT_GEMINI_BASE).trim().replace(/\/+$/, "");
    const model = String(env?.AI_IMAGE_MODEL || "gemini-2.5-flash-image").trim();
    const upstream = await fetch(`${base}/images/generations`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: `${prompt}\nStyle: ${style}.\nAspect ratio: ${ratio}.`,
        n: 1,
        response_format: "b64_json",
      }),
    });

    const raw = await upstream.text();
    let data = null;
    try { data = JSON.parse(raw); } catch {}
    if (!upstream.ok) {
      const detail = data?.error?.message || data?.message || raw.slice(0, 250) || `HTTP ${upstream.status}`;
      console.error("[MODEL AI] Image provider error", { providerStatus: upstream.status, detail: String(detail).slice(0, 250) });
      return json(502, { error: `Image provider error (HTTP ${upstream.status}).`, details: String(detail).slice(0, 250) });
    }
    const first = data?.data?.[0];
    if (typeof first?.b64_json === "string" && first.b64_json) {
      return json(200, { image: `data:image/png;base64,${first.b64_json}` });
    }
    if (typeof first?.url === "string" && first.url.startsWith("https://")) {
      return json(200, { image: first.url });
    }
    return json(502, { error: "No image was returned. Check that the selected model supports image generation and your account has access." });
  } catch (error) {
    console.error("[MODEL AI] Unexpected image function exception", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return json(500, { error: "Unexpected image server error.", details: String(error?.message || "Unknown error").slice(0, 220) });
  }
}
