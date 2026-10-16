// MODEL AI — Cloudflare Pages chat API
// Supports Gemini's OpenAI-compatible API.
// File path: functions/api/chat.js

const MAX_BODY = 5 * 1024 * 1024;
const MAX_MESSAGES = 20;
const MAX_TEXT_CHARS = 14000;

const DEFAULT_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/openai";

const HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

function json(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: HEADERS,
  });
}

// Diagnostic route: GET /api/chat
export function onRequestGet() {
  return json(200, {
    ok: true,
    route: "/api/chat",
    message: "MODEL AI chat function is deployed. Use POST to chat.",
  });
}

// Actual AI chat route: POST /api/chat
export async function onRequestPost({ request, env }) {
  try {
    const apiKey = String(env?.AI_API_KEY || "").trim();
    const model = String(env?.AI_CHAT_MODEL || "").trim();

    const base = String(
      env?.AI_API_BASE_URL || DEFAULT_API_BASE
    )
      .trim()
      .replace(/\/+$/, "");

    // Check Cloudflare configuration.
    if (!apiKey || !model) {
      return json(503, {
        error:
          "AI is not configured. Add AI_API_KEY as a Cloudflare Secret and AI_CHAT_MODEL as a variable.",
      });
    }

    // Check request size.
    const contentLength = Number(
      request.headers.get("content-length") || "0"
    );

    if (contentLength > MAX_BODY) {
      return json(413, {
        error: "Request is too large. Please reduce the message or image size.",
      });
    }

    // Read JSON request.
    let body;

    try {
      body = await request.json();
    } catch {
      return json(400, {
        error: "Invalid JSON request.",
      });
    }

    if (
      !body ||
      !Array.isArray(body.messages) ||
      body.messages.length < 1 ||
      body.messages.length > MAX_MESSAGES
    ) {
      return json(400, {
        error: `Send between 1 and ${MAX_MESSAGES} messages.`,
      });
    }

    // Validate the conversation.
    let totalChars = 0;

    for (const message of body.messages) {
      if (
        !message ||
        !["user", "assistant", "system"].includes(message.role)
      ) {
        return json(400, {
          error: "Unsupported message format.",
        });
      }

      if (typeof message.content === "string") {
        totalChars += message.content.length;
      } else if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (
            part?.type === "text" &&
            typeof part.text === "string"
          ) {
            totalChars += part.text.length;
          } else if (part?.type === "image_url") {
            const imageUrl = part?.image_url?.url;

            if (
              typeof imageUrl !== "string" ||
              !imageUrl.startsWith("data:image/")
            ) {
              return json(400, {
                error: "Images must use valid image data URLs.",
              });
            }

            totalChars += imageUrl.length;
          }
        }
      } else {
        return json(400, {
          error: "Message content must be text or supported image content.",
        });
      }
    }

    if (totalChars > MAX_TEXT_CHARS + MAX_BODY) {
      return json(413, {
        error: "Request content is too large.",
      });
    }

    // Send the request to Gemini.
    const apiUrl = `${base}/chat/completions`;

    let upstream;

    try {
      upstream = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: body.messages,
          temperature: 0.7,
          max_tokens: 1200,
        }),
      });
    } catch (error) {
      console.error(
        "MODEL AI: Failed to connect to AI provider:",
        error?.message || String(error)
      );

      return json(502, {
        error:
          "Could not connect to the AI provider. Check Cloudflare settings and provider availability.",
      });
    }

    const raw = await upstream.text();

    let data = {};

    try {
      data = JSON.parse(raw);
    } catch {
      data = {};
    }

    // Return a helpful error if the provider rejects the request.
    if (!upstream.ok) {
      const detail =
        data?.error?.message ||
        data?.message ||
        `The provider returned HTTP ${upstream.status}.`;

      console.error("MODEL AI provider error:", {
        status: upstream.status,
        detail: String(detail).slice(0, 400),
      });

      return json(502, {
        error: `Gemini API error (HTTP ${upstream.status}): ${String(
          detail
        ).slice(0, 400)}`,
      });
    }

    if (!raw || Object.keys(data).length === 0) {
      return json(502, {
        error: "The AI provider returned an invalid response.",
      });
    }

    // Extract the AI response.
    const content = data?.choices?.[0]?.message?.content;

    const answer = Array.isArray(content)
      ? content
          .map((part) => part?.text || "")
          .join("\n")
      : content;

    if (typeof answer !== "string" || !answer.trim()) {
      console.error(
        "MODEL AI: Provider response did not contain chat text."
      );

      return json(502, {
        error:
          "The AI provider returned no text. Check the selected model and its access.",
      });
    }

    return json(200, {
      text: answer.trim(),
    });
  } catch (error) {
    console.error(
      "MODEL AI chat function error:",
      error?.stack || error?.message || String(error)
    );

    return json(500, {
      error:
        "An internal chat server error occurred. Check Cloudflare Functions logs.",
    });
  }
}
