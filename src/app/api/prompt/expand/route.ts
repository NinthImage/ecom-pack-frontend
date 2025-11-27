import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || "";
    const openaiModel: string = body?.model || process.env.OPENAI_MODEL || "gpt-4o-mini";
    const geminiModel: string = process.env.GEMINI_MODEL || "gemini-1.5-pro";
    const temperature: number = typeof body?.temperature === "number" ? body.temperature : 0.7;
    const explicitProvider: "google" | "openai" | undefined = body?.provider ? String(body.provider).toLowerCase() as any : undefined;

    if (!prompt.trim()) {
      return Response.json({ error: "Missing prompt" }, { status: 400 });
    }

    const hasGoogle = Boolean(process.env.GOOGLE_API_KEY);
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
    const provider: "google" | "openai" | undefined = explicitProvider ?? (hasGoogle ? "google" : (hasOpenAI ? "openai" : undefined));
    if (!provider) {
      return Response.json({ error: "Missing both GOOGLE_API_KEY and OPENAI_API_KEY" }, { status: 500 });
    }

    const system = `You are a helpful assistant that writes production-ready, structured prompts for Text-to-Video generation.
Return a coherent prompt that keeps the user's intent but expands it into the following labeled sections and remains under 1200 characters:
Visual Style: ...\nCamera Style: ...\nLighting: ...\nVoice:\n- Gender: ...\n- Tone: ...\n- Accent: ...\n- Speed: ...\nMusic & Sound Effects:\n- Background Music: ...\n- Sound Effects: ...\nDo not add disclaimers. Do not include brackets unless the user included them. Keep the language concise and descriptive.`;

    const user = `User Prompt:\n${prompt}\n\nTask: Expand and format into the labeled sections shown above.`;

    if (provider === "google") {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        if (hasOpenAI) {
          const apiKey = process.env.OPENAI_API_KEY!;
          const oRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ model: openaiModel, temperature, messages: [ { role: "system", content: system }, { role: "user", content: user } ] }),
          });
          if (!oRes.ok) { const oErr = await oRes.text(); return Response.json({ error: `OpenAI error: ${oErr}` }, { status: 500 }); }
          const oData = await oRes.json();
          const oContent: string = oData?.choices?.[0]?.message?.content || "";
          return Response.json({ expanded: oContent, provider: "openai" });
        }
        return Response.json({ error: "Missing GOOGLE_API_KEY" }, { status: 500 });
      }
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
      const payload = {
        contents: [ { role: "user", parts: [ { text: system }, { text: user } ] } ],
        generationConfig: { temperature },
      };
      const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) {
        const errText = await response.text();
        // Fallback to OpenAI if available
        if (hasOpenAI) {
          const apiKey = process.env.OPENAI_API_KEY!;
          const oRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({
              model: openaiModel,
              temperature,
              messages: [ { role: "system", content: system }, { role: "user", content: user } ],
            }),
          });
          if (!oRes.ok) { const oErr = await oRes.text(); return Response.json({ error: `Gemini error: ${errText}; OpenAI error: ${oErr}` }, { status: 500 }); }
          const data = await oRes.json();
          const content: string = data?.choices?.[0]?.message?.content || "";
          return Response.json({ expanded: content, provider: "openai" });
        }
        return Response.json({ error: `Gemini error: ${errText}` }, { status: 500 });
      }
      const data = await response.json();
      const content: string = (data?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || "").join(" ").trim();
      return Response.json({ expanded: content, provider: "google" });
    }

    // OpenAI branch
    const apiKey = process.env.OPENAI_API_KEY!;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
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
      if (hasGoogle && /quota|insufficient|rate limit/i.test(errText)) {
        const apiKey = process.env.GOOGLE_API_KEY!;
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
        const payload = { contents: [ { role: "user", parts: [ { text: system }, { text: user } ] } ], generationConfig: { temperature } };
        const gRes = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!gRes.ok) { const gErr = await gRes.text(); return Response.json({ error: `OpenAI error: ${errText}; Gemini error: ${gErr}` }, { status: 500 }); }
        const gData = await gRes.json();
        const gContent: string = (gData?.candidates?.[0]?.content?.parts || []).map((p: any) => p?.text || "").join(" ").trim();
        return Response.json({ expanded: gContent, provider: "google" });
      }
      return Response.json({ error: `OpenAI error: ${errText}` }, { status: 500 });
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content || "";
    return Response.json({ expanded: content, provider: "openai" });
  } catch (err: any) {
    return Response.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
