// MODEL AI chat endpoint for Cloudflare Pages Functions.
// Text chat and image analysis use OpenRouter's free-model router.
// Image generation is a separate endpoint and needs its own configured image provider.
// Never expose provider API keys in frontend JavaScript or public GitHub.

const MAX_BODY = 5 * 1024 * 1024;
const MAX_MESSAGES = 20;
const DEFAULT_OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const DEFAULT_FREE_MODEL = "openrouter/free";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(status, payload) {
  return new Response(JSON.stringify(payload), { status, headers: HEADERS });
}

export function onRequestGet() {
  return json(200, {
    ok: true,
    route: "/api/chat",
    message: "MODEL AI chat route is active. Send POST for chat completions.",
  });
}

function containsImage(messages) {
  return messages.some((message) =>
    Array.isArray(message?.content) &&
    message.content.some((part) => part?.type === "image_url")
  );
}

export async function onRequestPost({ request, env }) {
  try {
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY) {
      return json(413, { error: "Request is too large. Reduce the text or image size." });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: "Request body is not valid JSON." });
    }

    if (!Array.isArray(body?.messages) || body.messages.length < 1 || body.messages.length > MAX_MESSAGES) {
      return json(400, { error: `Send between 1 and ${MAX_MESSAGES} messages.` });
    }

    for (const message of body.messages) {
      if (!message || !["user", "assistant", "system"].includes(message.role)) {
        return json(400, { error: "Unsupported message format." });
      }
      if (typeof message.content === "string") continue;
      if (!Array.isArray(message.content)) {
        return json(400, { error: "Message content must be text or supported image content." });
      }
      for (const part of message.content) {
        if (part?.type === "text" && typeof part.text === "string") continue;
        if (part?.type === "image_url") {
          const url = part?.image_url?.url;
          if (typeof url !== "string" || !url.startsWith("data:image/")) {
            return json(400, { error: "Images must be sent as image data URLs." });
          }
          continue;
        }
        return json(400, { error: "Unsupported content part in message." });
      }
    }

    const visionRequest = containsImage(body.messages);
    const apiKey = String(env?.AI_API_KEY || "").trim();
    const baseUrl = String(env?.AI_API_BASE_URL || DEFAULT_OPENROUTER_BASE)
      .trim()
      .replace(/\/+$/, "");
    const model = String(
      visionRequest
        ? (env?.AI_VISION_MODEL || DEFAULT_FREE_MODEL)
        : (env?.AI_CHAT_MODEL || DEFAULT_FREE_MODEL)
    ).trim();

    if (!apiKey) {
      return json(503, {
        error: "AI is not configured. Add AI_API_KEY as an encrypted Cloudflare Secret containing your OpenRouter API key.",
      });
    }

    const url = `${baseUrl}/chat/completions`;
    console.log("[MODEL AI] OpenRouter request", {
      mode: visionRequest ? "image analysis" : "text chat",
      model,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    let upstream;
    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://modelaitools.online",
          "X-OpenRouter-Title": "MODEL AI",
        },
        body: JSON.stringify({
          model,
          messages: body.messages,
          max_tokens: 1200,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      const timedOut = error?.name === "AbortError";
      console.error("[MODEL AI] OpenRouter network error", {
        name: error?.name,
        message: error?.message,
      });
      return json(502, {
        error: timedOut ? "The free AI provider timed out. Try again shortly." : "Could not connect to OpenRouter.",
        details: String(error?.message || "Network request failed").slice(0, 220),
      });
    } finally {
      clearTimeout(timer);
    }

    const raw = await upstream.text();
    let data = null;
    try { data = JSON.parse(raw); } catch {}

    if (!upstream.ok) {
      const detail = data?.error?.message || data?.message || raw.slice(0, 250) || `HTTP ${upstream.status}`;
      console.error("[MODEL AI] OpenRouter provider error", {
        providerStatus: upstream.status,
        detail: String(detail).slice(0, 250),
      });
      return json(502, {
        error: `OpenRouter API error (HTTP ${upstream.status}).`,
        providerStatus: upstream.status,
        details: String(detail).slice(0, 250),
      });
    }

    if (!data) {
      console.error("[MODEL AI] OpenRouter returned non-JSON response", { status: upstream.status });
      return json(502, { error: "OpenRouter returned an unreadable response." });
    }

    const content = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
      ? content.map((part) => part?.text || "").join("\n")
      : content;

    if (typeof text !== "string" || !text.trim()) {
      console.error("[MODEL AI] OpenRouter returned no text", { model });
      return json(502, {
        error: "The free model returned no text. Try again or inspect the provider details.",
      });
    }

    return json(200, { text: text.trim() });
  } catch (error) {
    console.error("[MODEL AI] Unexpected chat function exception", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return json(500, {
      error: "Unexpected chat server error.",
      details: String(error?.message || "Unknown error").slice(0, 220),
    });
  }
}
