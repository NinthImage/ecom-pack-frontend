import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = String(body?.prompt || "");
    const model: string = String(body?.model || "Nano Banana");
    const ratio: string = String(body?.ratio || "1:1");
    const count: number = Number(body?.count || 1);
    const dataUrl: string | undefined = body?.imageDataUrl;

    // Simulate minimal processing time to mimic generation
    await new Promise((r) => setTimeout(r, 800));

    // For now, simply echo the uploaded image if present, otherwise fallback to a bundled asset.
    const previewUrl = dataUrl || "/globe.svg";

    return Response.json({
      ok: true,
      previewUrl,
      meta: { prompt, model, ratio, count }
    });
  } catch (err: any) {
    return Response.json({ ok: false, error: String(err?.message || err) }, { status: 500 });
  }
}
