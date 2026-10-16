// MODEL AI — Cloudflare Pages chat function
const DEFAULT_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/openai";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: HEADERS,
  });
}

// Health check: GET /api/chat
export function onRequestGet() {
  return json(200, {
    ok: true,
    message: "MODEL AI chat route is active.",
  });
}

// AI chat: POST /api/chat
export async function onRequestPost({ request, env }) {
  console.log("[MODEL AI] POST handler started");

  try {
    const apiKey = String(env?.AI_API_KEY || "").trim();
    const model = String(env?.AI_CHAT_MODEL || "").trim();
    const base = String(
      env?.AI_API_BASE_URL || DEFAULT_API_BASE
    ).trim().replace(/\/+$/, "");

    if (!apiKey || !model) {
      console.error("[MODEL AI] API key or model is missing");

      return json(503, {
        error: "Missing AI_API_KEY or AI_CHAT_MODEL in Cloudflare settings.",
      });
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return json(400, { error: "Request body is not valid JSON." });
    }

    if (!Array.isArray(body?.messages) || body.messages.length === 0) {
      return json(400, { error: "No chat messages were supplied." });
    }

    const url = `${base}/chat/completions`;

    console.log("[MODEL AI] Calling provider", {
      model,
      endpoint: url,
      messages: body.messages.length,
    });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);

    let upstream;

    try {
      upstream = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: body.messages,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      console.error("[MODEL AI] Provider fetch failed", {
        name: error?.name,
        message: error?.message,
      });

      return json(502, {
        error: "Could not connect to the AI provider.",
        details:
          error?.name === "AbortError"
            ? "The provider request timed out."
            : String(error?.message || "Network request failed").slice(0, 250),
      });
    } finally {
      clearTimeout(timer);
    }

    const raw = await upstream.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = null;
    }

    console.log("[MODEL AI] Provider responded", {
      status: upstream.status,
      contentType: upstream.headers.get("content-type"),
    });

    if (!upstream.ok) {
      const detail =
        data?.error?.message ||
        data?.message ||
        raw.slice(0, 300) ||
        "No provider error details returned.";

      console.error("[MODEL AI] Provider rejected request", {
        status: upstream.status,
        detail: String(detail).slice(0, 300),
      });

      return json(502, {
        error: "AI provider returned an error.",
        providerStatus: upstream.status,
        details: String(detail).slice(0, 300),
      });
    }

    const content = data?.choices?.[0]?.message?.content;
    const answer = Array.isArray(content)
      ? content.map((part) => part?.text || "").join("\n")
      : content;

    if (typeof answer !== "string" || !answer.trim()) {
      console.error("[MODEL AI] Provider response contained no text");

      return json(502, {
        error: "The provider returned no text.",
        details: "Check the selected model and provider response.",
      });
    }

    return json(200, { text: answer.trim() });
  } catch (error) {
    console.error("[MODEL AI] Unexpected function error", {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });

    return json(500, {
      error: "Unexpected server-side chat error.",
      details: String(error?.message || "Unknown error").slice(0, 250),
    });
  }
}
