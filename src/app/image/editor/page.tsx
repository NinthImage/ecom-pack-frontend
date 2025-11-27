"use client";

import { useEffect, useRef, useState } from "react";
import { VideoSidebar } from "@/components/video-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Upload, Loader2, Maximize2, ExternalLink } from "lucide-react";

type RefImage = { id: string; url: string; file?: File };

export default function ImageEditorPage() {
  const [model, setModel] = useState<string>("Nano Banana");
  const [prompt, setPrompt] = useState<string>("");
  const [references, setReferences] = useState<RefImage[]>([]);
  const [ratio, setRatio] = useState<string>("1:1");
  const [count, setCount] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const promptLimit = 3500;

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    const next: RefImage[] = arr
      .slice(0, Math.max(0, 10 - references.length))
      .map((f) => ({ id: `${Date.now()}-${f.name}`, url: URL.createObjectURL(f), file: f }));
    if (next.length) setReferences((r) => [...r, ...next]);
  }

  function removeRef(id: string) {
    setReferences((r) => r.filter((x) => x.id !== id));
  }

  async function toDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleGenerate() {
    try {
      setIsGenerating(true);
      const firstFile = references[0]?.file ? await toDataUrl(references[0].file!) : undefined;
      const res = await fetch("/api/image/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model, ratio, count, imageDataUrl: firstFile })
      });
      const data = await res.json();
      setPreviewUrl(data?.previewUrl || "/globe.svg");
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    return () => {
      references.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, [references]);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-6">
        {/* Premium banner */}
        <div className="rounded-md border bg-muted/20 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="text-sm">
            <span className="font-medium">Premium users generate 5x faster</span>
            <span className="text-muted-foreground"> — Upgrade for speed & priority</span>
          </div>
          <Badge variant="secondary" className="w-fit">Upgrade Now</Badge>
        </div>

        {/* Editor and Preview */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Editor */}
          <Card>
            <CardHeader>
              <CardTitle>AI Image Editor</CardTitle>
              <CardDescription>Clone of the shown editor UI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <select className="h-10 w-full rounded-md border bg-background px-3 text-sm" value={model} onChange={(e) => setModel(e.target.value)}>
                  <option>Nano Banana</option>
                  <option>Flux Pro</option>
                  <option>Seedream</option>
                  <option>Imagen4 Ultra</option>
                </select>
              </div>

              {/* Reference Images */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Reference Images (Max 10)</label>
                <div
                  className="rounded-md border border-dashed p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 min-h-[120px]"
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
                >
                  {references.map((ref) => (
                    <div key={ref.id} className="relative group">
                      <div className="aspect-square w-full rounded-md overflow-hidden border">
                        <img src={ref.url} alt="ref" className="h-full w-full object-cover" />
                      </div>
                      <button
                        className="absolute top-1 right-1 text-[10px] rounded bg-black/50 text-white px-1 py-0.5 opacity-0 group-hover:opacity-100"
                        onClick={() => removeRef(ref.id)}
                        aria-label="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {references.length < 10 && (
                    <button
                      type="button"
                      className="flex items-center justify-center aspect-square rounded-md border border-dashed text-xs text-muted-foreground hover:bg-muted/20"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4 mr-1" /> Add
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Prompt</label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-violet-600 text-white">Smart Expansion</Badge>
                    <span className="text-[11px] text-violet-600 font-medium">{prompt.length}/{promptLimit}</span>
                  </div>
                </div>
                <textarea
                  className="w-full rounded-md border bg-background p-3 text-sm min-h-[120px]"
                  placeholder="Describe the edit you want (style, lighting, mood)"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select className="h-9 w-full rounded-md border bg-background px-2 text-sm" value={count} onChange={(e) => setCount(Number(e.target.value))}>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                  {/* Aspect Ratio segmented pills to match reference */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {["1:1","3:4","4:3","16:9","9:16"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRatio(r)}
                        className={`h-9 px-3 rounded-md text-sm border ${ratio===r?"bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-black dark:border-white":"bg-background hover:bg-muted/50"}`}
                        aria-pressed={ratio===r}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <Button onClick={handleGenerate} disabled={isGenerating} className="justify-between sm:justify-between">
                    {isGenerating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
                    ) : (
                      <>
                        <span>Generate</span>
                        <span className="ml-3 rounded-full bg-violet-600 text-white px-2 py-[2px] text-[11px]">credits: 10</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right: Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Generated result and variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border bg-black/5">
                <div className="aspect-[4/3] flex items-center justify-center bg-muted/30">
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="h-full w-full object-contain" />
                  ) : (
                    <div className="text-center text-sm text-muted-foreground p-6">
                      <ImageIcon className="w-10 h-10 mx-auto mb-2" />
                      Drop or add a reference image and click Generate
                    </div>
                  )}
                </div>
                {/* preview overlay actions */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/70" aria-label="Zoom">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/70" aria-label="Open in new">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                {/* status line akin to reference site */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 px-3 py-2 text-xs text-muted-foreground border-t">
                  <div>Prompt: {prompt ? prompt.slice(0, 80) + (prompt.length > 80 ? "…" : "") : "—"}</div>
                  <div className="flex items-center gap-2">
                    <span>{new Date().toLocaleString()}</span>
                    <span>• auto • {ratio}</span>
                  </div>
                </div>
              </div>

              {/* Gallery with model badges, horizontal scroll */}
              <div className="space-y-2">
                <div className="text-sm font-medium">Edited Images Using Different Models</div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 pr-2 snap-x snap-mandatory">
                  {[
                    { name: "Nano Banana", badge: "NEW", color: "bg-violet-600" },
                    { name: "Flux Pro", badge: "FAST", color: "bg-cyan-600" },
                    { name: "Seedream", badge: "QUALITY", color: "bg-pink-600" },
                    { name: "Imagen4 Ultra", badge: "PRO", color: "bg-indigo-600" },
                    { name: "Krea", badge: "STYLE", color: "bg-green-600" },
                    { name: "Hunyuan", badge: "DETAIL", color: "bg-rose-600" },
                    { name: "Stable Diffusion", badge: "OPEN", color: "bg-slate-600" },
                    { name: "Replicate Flux", badge: "CLOUD", color: "bg-amber-600" },
                  ].map((m, i) => (
                    <div key={i} className="relative rounded-lg overflow-hidden border min-w-[160px] snap-start">
                      <div className="aspect-square bg-muted/20 flex items-center justify-center">
                        {previewUrl ? (
                          <img src={previewUrl} alt={m.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="text-xs text-muted-foreground">{m.name}</div>
                        )}
                      </div>
                      <div className="absolute top-1 left-1 flex items-center gap-1">
                        <span className={`px-1.5 py-0.5 text-[10px] rounded text-white ${m.color}`}>{m.badge}</span>
                        <span className="px-1.5 py-0.5 text-[10px] rounded bg-black/60 text-white">{m.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Marketing sections cloned from reference layout */}
        <section className="space-y-8">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-xl md:text-2xl font-bold">AI Image Editor</h2>
            <p className="mt-2 text-sm md:text-base text-muted-foreground">Seamlessly edit any image with text prompts without leaving the page.</p>
          </div>

          {/* Before / After */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Before</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted/20 flex items-center justify-center">
                  {references[0] ? (
                    <img src={references[0].url} alt="original" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Original Image</div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>After</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-muted/20 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="edited" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Edited Image</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Feature cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[{
              title: "Old Photo Fix & Colorize",
              desc: "Restore damaged photos and colorize black-and-white images.",
            },{
              title: "Background Remover",
              desc: "Instantly extract subjects and create professional composites.",
            },{
              title: "Object Remove & Add",
              desc: "Erase distractions or add new elements by description.",
            },{
              title: "Image Upscale & Enhancer",
              desc: "Increase resolution and enhance details intelligently.",
            }].map((f,i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Steps */}
          <div className="rounded-xl border p-6">
            <h3 className="text-lg md:text-xl font-semibold mb-4">Create Your Image in 3 Steps</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">1 — Set Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Upload references and describe your vision.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">2 — Adjust Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Choose your model and output size.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">3 — Get Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Generate, then fine‑tune or export.</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-4">
              <Button onClick={handleGenerate} disabled={isGenerating}>
                Try AI Image Editor Now
              </Button>
            </div>
          </div>

          {/* FAQs using details/summary */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
            {[
              {q: "Does NinthImage offer a free plan?", a: "Yes. Start with a free tier to experience core features. Paid plans unlock higher usage limits, priority processing, and advanced editing tools."},
              {q: "Can I use the images commercially?", a: "Yes. You retain commercial rights to assets created in the editor. Please review your account’s license terms for specifics."},
              {q: "Do you support reference images and editing?", a: "Yes. Upload reference images to guide generation, and use tools like Erase & Replace, Background Removal, and Upscale."},
              {q: "Which models are available?", a: "Multiple options including Seedream, Nano Banana, Flux and others—configurable from the Model selector."},
              {q: "How long does generation take?", a: "Most operations complete within seconds. Complex prompts or larger sizes may take longer."}
            ].map((item, i) => (
              <details key={i} className="rounded-md border p-3">
                <summary className="cursor-pointer text-sm font-medium">{item.q}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
