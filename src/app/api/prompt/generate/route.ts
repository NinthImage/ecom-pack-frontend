import type { NextRequest } from "next/server";

export const runtime = "nodejs";

type Format = "prompt" | "text" | "json" | "other";
type Provider = "openai" | "google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: string = String(body?.input || "");
    const format: Format = (body?.format || "prompt").toLowerCase() as Format;
    const temperature: number = typeof body?.temperature === "number" ? body.temperature : 0.7;
    const extraInstructions: string = String(body?.instructions || "");
    const language: string = String(body?.language || "english").toLowerCase();
    const task: string = String(body?.task || "").toLowerCase();
    const explicitProvider: Provider | undefined = body?.provider ? String(body.provider).toLowerCase() as Provider : undefined;
    const openaiModel: string = body?.model || process.env.OPENAI_MODEL || "gpt-5.1";
    const geminiModel: string = process.env.GEMINI_MODEL || "gemini-1.5-pro";

    if (!input.trim()) {
      return Response.json({ error: "Missing input" }, { status: 400 });
    }

    // Build shared prompt content for both providers
    const baseInstruction = `You are a helpful assistant for AI content creation. Be concise, concrete, and production-ready.`;
    const languageInstruction = language.includes("zh") || language.includes("chinese")
      ? "Respond in Simplified Chinese."
      : "Respond in English.";

    let system: string;
    let user: string;

    switch (format) {
      case "prompt":
        system = `${baseInstruction}\n${languageInstruction}\nReturn a single, high-quality image-generation prompt for the user's topic. Include clear style modifiers (lighting, camera, colors, composition, texture). Stay under 300 words.`;
        user = `Topic: ${input}${extraInstructions ? `\nExtra Instructions: ${extraInstructions}` : ""}`;
        break;
      case "text":
        system = `${baseInstruction}\n${languageInstruction}\nWrite a short descriptive paragraph that vividly describes the topic for inspiration. 150–250 words.`;
        user = `Topic: ${input}${extraInstructions ? `\nExtra Instructions: ${extraInstructions}` : ""}`;
        break;
      case "json":
        system = `${baseInstruction}\n${languageInstruction}\nReturn ONLY valid JSON (no code fences). Keys: prompt (string), style_modifiers (array of strings), camera (string), lighting (string), colors (string), composition (string). Keep values concise.`;
        user = `Topic: ${input}${extraInstructions ? `\nExtra Instructions: ${extraInstructions}` : ""}`;
        break;
      default:
        system = `${baseInstruction}\n${languageInstruction}\nReturn 5 creative variations related to the user's topic as a numbered list, each 1 sentence.`;
        user = `Topic: ${input}${extraInstructions ? `\nExtra Instructions: ${extraInstructions}` : ""}`;
        break;
    }

    // Decide provider:
    // 1) explicit wins
    // 2) else prefer Gemini if GOOGLE_API_KEY is available
    // 3) else use OpenAI if OPENAI_API_KEY is available
    // 4) else return missing keys
    const hasGoogle = Boolean(process.env.GOOGLE_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const inferredProvider: Provider | undefined = explicitProvider ?? (hasGoogle ? "google" : (hasOpenAI ? "openai" : undefined));
    if (!inferredProvider) {
      return Response.json({ error: "Missing both GOOGLE_API_KEY and OPENAI_API_KEY" }, { status: 500 });
    }

    if (inferredProvider === "google") {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        // If Google key missing but OpenAI is present, auto-fallback
        if (hasOpenAI) {
          const apiKey = process.env.OPENAI_API_KEY!;
          const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: openaiModel,
              temperature,
              messages: [ { role: "system", content: system }, { role: "user", content: user } ],
            }),
          });
          if (!response.ok) { const errText = await response.text(); return Response.json({ error: `OpenAI error: ${errText}` }, { status: 500 }); }
          const data = await response.json();
          const content: string = data?.choices?.[0]?.message?.content || "";
          if (format === "json") {
            try { const parsed = JSON.parse(content); return Response.json({ json: parsed, text: content, provider: "openai" }); }
            catch { return Response.json({ text: content, error: "Invalid JSON returned", provider: "openai" }, { status: 200 }); }
          }
          return Response.json({ text: content, provider: "openai" });
        }
        return Response.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: system },
              { text: user },
            ],
          },
        ],
        generationConfig: { temperature },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errText = await response.text();
        return Response.json({ error: `Gemini error: ${errText}` }, { status: 500 });
      }

      const data = await response.json();
      const content: string = (data?.candidates?.[0]?.content?.parts || [])
        .map((p: any) => p?.text || "")
        .join(" ")
        .trim();

      if (format === "json") {
        try {
          const parsed = JSON.parse(content);
          return Response.json({ json: parsed, text: content, provider: "google" });
        } catch {
          return Response.json({ text: content, error: "Invalid JSON returned", provider: "google" }, { status: 200 });
        }
      }

      return Response.json({ text: content, provider: "google" });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // If OpenAI key missing but Google is present, auto-fallback to Google
      if (hasGoogle) {
        // Re-run with google branch
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
        const payload = {
          contents: [
            {
              role: "user",
              parts: [
                { text: system },
                { text: user },
              ],
            },
          ],
          generationConfig: { temperature },
        };
        const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!response.ok) {
          const errText = await response.text();
          return Response.json({ error: `Gemini error: ${errText}` }, { status: 500 });
        }
        const data = await response.json();
        const content: string = (data?.candidates?.[0]?.content?.parts || [])
          .map((p: any) => p?.text || "")
          .join(" ")
          .trim();
        if (format === "json") {
          try { const parsed = JSON.parse(content); return Response.json({ json: parsed, text: content, provider: "google" }); }
          catch { return Response.json({ text: content, error: "Invalid JSON returned", provider: "google" }, { status: 200 }); }
        }
        return Response.json({ text: content, provider: "google" });
      }
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    // system/user already built above and reused for both providers

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: openaiModel,
        temperature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      // If OpenAI quota exceeded and we have Google, auto-fallback
      if (hasGoogle && /quota|insufficient|rate limit/i.test(errText)) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${process.env.GOOGLE_API_KEY}`;
        const payload = {
          contents: [
            { role: "user", parts: [ { text: system }, { text: user } ] }
          ],
          generationConfig: { temperature },
        };
        const gRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!gRes.ok) {
          const gErr = await gRes.text();
          return Response.json({ error: `OpenAI error: ${errText}; Gemini error: ${gErr}` }, { status: 500 });
        }
        const gData = await gRes.json();
        const gContent: string = (gData?.candidates?.[0]?.content?.parts || [])
          .map((p: any) => p?.text || "")
          .join(" ")
          .trim();
        if (format === "json") {
          try { const parsed = JSON.parse(gContent); return Response.json({ json: parsed, text: gContent, provider: "google" }); }
          catch { return Response.json({ text: gContent, error: "Invalid JSON returned", provider: "google" }, { status: 200 }); }
        }
        return Response.json({ text: gContent, provider: "google" });
      }
      return Response.json({ error: `OpenAI error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content || "";

    if (format === "json") {
      try {
        const parsed = JSON.parse(content);
        return Response.json({ json: parsed, text: content, provider: "openai" });
      } catch {
        return Response.json({ text: content, error: "Invalid JSON returned", provider: "openai" }, { status: 200 });
      }
    }

    return Response.json({ text: content, provider: "openai" });
  } catch (err: any) {
    return Response.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
