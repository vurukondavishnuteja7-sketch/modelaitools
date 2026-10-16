// MODEL AI image generation endpoint for Cloudflare Pages Functions.
// Uses Google's OpenAI-compatible Gemini API. Never put the API key in frontend code.
export async function onRequestPost({ request, env }) {
  const json = (status, data) => new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
  });
  if (!env.AI_API_KEY) return json(503, { error: "Image API is not configured. Add AI_API_KEY as an encrypted Cloudflare secret." });
  let body;
  try { body = await request.json(); } catch { return json(400, { error: "Invalid JSON request." }); }
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const style = typeof body?.style === "string" ? body.style.slice(0, 80) : "Realistic";
  const ratio = ["1:1", "16:9", "9:16", "4:3"].includes(body?.ratio) ? body.ratio : "1:1";
  if (!prompt || prompt.length > 3000) return json(400, { error: "Enter an image prompt under 3,000 characters." });
  const base = String(env.AI_API_BASE_URL || "https://generativelanguage.googleapis.com/v1beta/openai").replace(/\/+$/, "");
  const model = String(env.AI_IMAGE_MODEL || "gemini-2.5-flash-image");
  try {
    const upstream = await fetch(`${base}/images/generations`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.AI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt: `${prompt}\nStyle: ${style}.\nAspect ratio: ${ratio}.`,
        n: 1,
        response_format: "b64_json"
      })
    });
    const raw = await upstream.text();
    if (!upstream.ok) {
      let detail = "";
      try { const parsed = JSON.parse(raw); detail = parsed?.error?.message || parsed?.message || ""; } catch {}
      return json(502, { error: detail || `Image provider returned HTTP ${upstream.status}. Check model access, quota and billing settings.` });
    }
    let data;
    try { data = JSON.parse(raw); } catch { return json(502, { error: "Image provider returned an unreadable response." }); }
    const first = data?.data?.[0];
    if (typeof first?.b64_json === "string" && first.b64_json) return json(200, { image: `data:image/png;base64,${first.b64_json}` });
    if (typeof first?.url === "string" && first.url.startsWith("https://")) return json(200, { image: first.url });
    return json(502, { error: "No image was returned. Check that your image model supports the images/generations endpoint." });
  } catch {
    return json(502, { error: "Could not reach the image provider. Check the endpoint and try again." });
  }
}
