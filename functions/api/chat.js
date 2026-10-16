// MODEL AI: server-side, OpenAI-compatible chat proxy for Cloudflare Pages Functions.
// Configure AI_API_BASE_URL, AI_API_KEY and AI_CHAT_MODEL in Pages > Settings > Variables and Secrets.
// Never put the provider key in public frontend JavaScript or commit it to GitHub.
const MAX_BODY = 5 * 1024 * 1024;
const MAX_MESSAGES = 20;
const MAX_TEXT_CHARS = 14000;
export async function onRequestPost({ request, env }) {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  const json = (status, payload) => new Response(JSON.stringify(payload), { status, headers });
  if (!env.AI_API_KEY || !env.AI_API_BASE_URL || !env.AI_CHAT_MODEL) {
    return json(503, { error: "AI is not configured yet. The site owner must add AI_API_BASE_URL, AI_API_KEY and AI_CHAT_MODEL as server-side Cloudflare secrets." });
  }
  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY) return json(413, { error: "Request is too large. Reduce the text or image size and try again." });
  let body;
  try { body = await request.json(); } catch { return json(400, { error: "Invalid JSON request." }); }
  if (!body || !Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) {
    return json(400, { error: `Send between 1 and ${MAX_MESSAGES} messages.` });
  }
  let totalChars = 0;
  for (const msg of body.messages) {
    if (!msg || !["user", "assistant", "system"].includes(msg.role)) return json(400, { error: "Unsupported message format." });
    const content = msg.content;
    if (typeof content === "string") totalChars += content.length;
    else if (Array.isArray(content)) {
      for (const part of content) {
        if (part?.type === "text" && typeof part.text === "string") totalChars += part.text.length;
        if (part?.type === "image_url") {
          const url = part?.image_url?.url;
          if (typeof url !== "string" || !url.startsWith("data:image/")) return json(400, { error: "Images must be sent as image data URLs." });
          totalChars += url.length;
        }
      }
    } else return json(400, { error: "Message content must be text or supported multimodal content." });
  }
  if (totalChars > MAX_TEXT_CHARS + MAX_BODY) return json(413, { error: "Request content exceeds the supported limit." });
  try {
    const base = String(env.AI_API_BASE_URL).replace(/\/+$/, "");
    const upstream = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${env.AI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: env.AI_CHAT_MODEL, messages: body.messages, temperature: 0.7, max_tokens: 1200 }),
    });
    const raw = await upstream.text();
    if (!upstream.ok) return json(502, { error: `AI provider returned status ${upstream.status}. Check your model, provider quota and API settings.` });
    let data;
    try { data = JSON.parse(raw); } catch { return json(502, { error: "The AI provider returned an unreadable response." }); }
    const content = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(content) ? content.map(p => p?.text || "").join("\n") : content;
    if (typeof text !== "string" || !text.trim()) return json(502, { error: "The AI provider did not return text. Check that the selected model supports chat completions." });
    return json(200, { text });
  } catch (err) {
    return json(502, { error: "Could not reach the AI provider. Check the configured endpoint and provider availability." });
  }
}
