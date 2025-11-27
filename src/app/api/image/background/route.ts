import type { NextRequest } from "next/server";

export const runtime = "nodejs";

type Style = "gradient" | "pattern" | "photo";
type Provider = "openai" | "google";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input: string = String(body?.input || "");
    const style: Style = (body?.style || "gradient").toLowerCase() as Style;
    // Prefer google when available
    const hasGoogle = Boolean(process.env.GOOGLE_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const provider: Provider = (body?.provider ? String(body.provider).toLowerCase() as Provider : (hasGoogle ? "google" : "openai"));
    const language: string = String(body?.language || "english").toLowerCase();
    const temperature: number = typeof body?.temperature === "number" ? body.temperature : 0.4;

    if (!input.trim()) {
      return Response.json({ error: "Missing input" }, { status: 400 });
    }

    const base = `Be concise and production-ready for UI use.`;
    const lang = language.includes("zh") || language.includes("chinese")
      ? "Respond in Simplified Chinese."
      : "Respond in English.";

    let system = `${base}\n${lang}`;
    let user = "";

    if (style === "gradient") {
      system += `\nReturn ONLY valid JSON (no code fences) with keys: css_gradient (string, e.g., 'linear-gradient(135deg, #123456, #abcdef)'), palette (array of 5 hex strings), description (string). Keep values short.`;
      user = `Topic: ${input}\nTask: Suggest a modern, elegant background gradient suitable for a landing page.`;
    } else if (style === "pattern") {
      system += `\nReturn ONLY valid JSON with keys: pattern (string, short name), css (string for a lightweight repeating css background using gradients), palette (array of 5 hex strings).`;
      user = `Topic: ${input}\nTask: Provide a subtle pattern and CSS usable as a background.`;
    } else {
      system += `\nReturn ONLY valid JSON with key: prompt (string describing a simple photo background with mood, lighting, color).`;
      user = `Topic: ${input}\nTask: Describe a photo background prompt suitable for image generation tools.`;
    }

    if (provider === "google") {
      const apiKey = process.env.GOOGLE_API_KEY;
      const model = process.env.GEMINI_MODEL || "gemini-1.5-pro";
      if (!apiKey) {
        // Fallback to OpenAI if possible
        if (hasOpenAI) {
          const oKey = process.env.OPENAI_API_KEY!;
          const oModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
          const oRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${oKey}` },
            body: JSON.stringify({ model: oModel, temperature, messages: [ { role: "system", content: system }, { role: "user", content: user } ] }),
          });
          if (!oRes.ok) { const oErr = await oRes.text(); return Response.json({ error: `OpenAI error: ${oErr}` }, { status: 500 }); }
          const oData = await oRes.json();
          const oText: string = oData?.choices?.[0]?.message?.content || "";
          try { const parsed = JSON.parse(oText); return Response.json({ json: parsed, text: oText, provider: "openai" }); }
          catch { return Response.json({ text: oText, provider: "openai" }); }
        }
        return Response.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ role: "user", parts: [{ text: system }, { text: user }] }],
        generationConfig: { temperature },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errText = await response.text();
        // Fallback to OpenAI if available
        if (hasOpenAI) {
          const oKey = process.env.OPENAI_API_KEY!;
          const oModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
          const oRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${oKey}` },
            body: JSON.stringify({
              model: oModel,
              temperature,
              messages: [
                { role: "system", content: system },
                { role: "user", content: user },
              ],
            }),
          });
          if (!oRes.ok) {
            const oErr = await oRes.text();
            return Response.json({ error: `Gemini error: ${errText}; OpenAI error: ${oErr}` }, { status: 500 });
          }
          const oData = await oRes.json();
          const oText: string = oData?.choices?.[0]?.message?.content || "";
          try { const parsed = JSON.parse(oText); return Response.json({ json: parsed, text: oText, provider: "openai" }); }
          catch { return Response.json({ text: oText, provider: "openai" }); }
        }
        return Response.json({ error: `Gemini error: ${errText}` }, { status: 500 });
      }
      const data = await response.json();
      const text: string = (data?.candidates?.[0]?.content?.parts || [])
        .map((p: any) => p?.text || "")
        .join(" ")
        .trim();

      try {
        const parsed = JSON.parse(text);
        return Response.json({ json: parsed, text, provider: "google" });
      } catch {
        return Response.json({ text, error: "Invalid JSON returned", provider: "google" }, { status: 200 });
      }
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    if (!apiKey) {
      if (hasGoogle) {
        // Fallback to google branch when OpenAI key missing
        const gKey = process.env.GOOGLE_API_KEY!;
        const gModel = process.env.GEMINI_MODEL || "gemini-1.5-pro";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${gKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: system }, { text: user }] }], generationConfig: { temperature } };
        const gRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!gRes.ok) { const gErr = await gRes.text(); return Response.json({ error: `Gemini error: ${gErr}` }, { status: 500 }); }
        const gData = await gRes.json();
        const text: string = (gData?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || "").join(" ").trim();
        try { const parsed = JSON.parse(text); return Response.json({ json: parsed, text, provider: "google" }); }
        catch { return Response.json({ text, provider: "google" }); }
      }
      return Response.json({ error: "Missing OPENAI_API_KEY" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!response.ok) {
      const errText = await response.text();
      // If quota/rate issues and we have Google, fallback
      if (hasGoogle && /quota|insufficient|rate limit/i.test(errText)) {
        const gKey = process.env.GOOGLE_API_KEY!;
        const gModel = process.env.GEMINI_MODEL || "gemini-1.5-pro";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${gModel}:generateContent?key=${gKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: system }, { text: user }] }], generationConfig: { temperature } };
        const gRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!gRes.ok) { const gErr = await gRes.text(); return Response.json({ error: `OpenAI error: ${errText}; Gemini error: ${gErr}` }, { status: 500 }); }
        const gData = await gRes.json();
        const text: string = (gData?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || "").join(" ").trim();
        try { const parsed = JSON.parse(text); return Response.json({ json: parsed, text, provider: "google" }); }
        catch { return Response.json({ text, provider: "google" }); }
      }
      return Response.json({ error: `OpenAI error: ${errText}` }, { status: 500 });
    }
    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content || "";

    try {
      const parsed = JSON.parse(content);
      return Response.json({ json: parsed, text: content, provider: "openai" });
    } catch {
      return Response.json({ text: content, error: "Invalid JSON returned", provider: "openai" }, { status: 200 });
    }
  } catch (err: any) {
    return Response.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
