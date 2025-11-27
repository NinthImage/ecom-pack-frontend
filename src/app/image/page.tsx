"use client";

import { useState, useEffect } from "react";
import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { models, Model } from "@/data/models";
import { Image as ImageIcon, Wand2, Star, X, Loader2 } from "lucide-react";

const imageModels: Model[] = models.filter((m: Model) => m.category === "image");

export default function ImagePage() {
  const [prompt, setPrompt] = useState("");
  const [ratio, setRatio] = useState("1:1");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(imageModels[0]?.id || "");
  const selectedModelData = imageModels.find((m) => m.id === selectedModel);
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModelPanel ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showModelPanel]);

  const ratios = ["1:1", "3:4", "4:3", "16:9", "9:16"] as const;

  async function handleSmartExpand() {
    if (!prompt.trim()) return;
    try {
      setIsExpanding(true);
      const res = await fetch("/api/prompt/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, temperature: 0.7 }),
      });
      const data = await res.json();
      if (res.ok && data?.expanded) {
        setPrompt(String(data.expanded));
      } else {
        console.error("Smart expand error:", data?.error || "Unknown error");
        alert(data?.error || "Failed to expand prompt. Check OPENAI_API_KEY.");
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to expand prompt. See console for details.");
    } finally {
      setIsExpanding(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        {/* Header removed per request */}

        {/* Generator */}
        <div className="grid lg:grid-cols-2 gap-8 relative">
          <Card>
            <CardHeader>
              <CardTitle>Prompt</CardTitle>
              <CardDescription>Use style modifiers for better results</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSmartExpand}
                  disabled={isExpanding || !prompt.trim()}
                  className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-linear-to-r from-fuchsia-500/10 to-purple-500/10 hover:from-fuchsia-500/20 hover:to-purple-500/20"
                >
                  {isExpanding ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Smart Expansion
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-3.5 w-3.5" />
                      Smart Expansion
                    </>
                  )}
                </Button>
              </div>
              {/* Model Selection - clickable opens overlay */}
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <div
                  role="button"
                  className="w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => setShowModelPanel(true)}
                  aria-label="Choose an AI model"
                >
                  <span className="truncate">
                    {selectedModelData ? selectedModelData.name : "Choose an AI model"}
                  </span>
                  <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {selectedModelData && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline">Image</Badge>
                    {(selectedModelData.features || []).slice(0, 2).map((t: string) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A serene forest landscape with mist and golden-hour light"
                className="w-full min-h-[120px] px-3 py-2 border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Aspect Ratio</label>
                <div className="flex flex-wrap gap-2">
                  {ratios.map((r) => (
                    <Button
                      key={r}
                      variant={ratio === r ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRatio(r)}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button disabled={isGenerating || !prompt.trim() || !selectedModel} className="flex-1">
                  Generate Image
                </Button>
                <Button variant="outline" onClick={() => { setPrompt(""); setIsGenerating(false); }}>
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your result will appear below</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Your preview appears here</div>
            </CardContent>
          </Card>

          {/* Overlay Panel */}
          {showModelPanel && (
            <div className="absolute inset-0 z-40">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg" />
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-neutral-800">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold">Model Selection</span>
                    <div className="w-full max-w-md">
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search models..."
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>
                  <button className="rounded-md p-1.5 hover:bg-muted" aria-label="Close" onClick={() => setShowModelPanel(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-4 py-3 text-sm font-medium flex items-center gap-2 border-b bg-gray-50 dark:bg-neutral-800">
                  <Star className="w-4 h-4 text-orange-500" /> Image Models ({imageModels.length})
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                    {imageModels
                      .filter((m: Model) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((m: Model) => (
                        <div key={m.id} className="group h-full" onClick={() => { setSelectedModel(m.id); setShowModelPanel(false); }}>
                          <div className="relative h-full flex flex-col rounded-2xl border border-purple-500/40 hover:border-purple-400 transition-all duration-200 cursor-pointer bg-neutral-900 text-neutral-100">
                            <div className="aspect-video rounded-t-2xl bg-muted/30 overflow-hidden relative">
                              {typeof m.credits === "number" && (
                                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-linear-to-r from-fuchsia-600 to-violet-600 text-white shadow">{m.credits} credits</div>
                              )}
                              <X className="hidden" />
                            </div>
                            <div className="flex-1 p-4 flex flex-col">
                              <div className="text-base font-semibold mb-1 flex items-center gap-2"><Star className="w-4 h-4 text-orange-500" /> {m.name}{m.version ? ` v${m.version}` : ""}</div>
                              <div className="text-sm text-neutral-300 line-clamp-2 mb-3 leading-5">{m.description}</div>
                              <div className="mt-auto pt-1 flex gap-1.5 flex-wrap">
                                {(m.features || []).slice(0, 6).map((t: string) => (
                                  <Badge key={t} variant="outline" className="text-xs px-2 py-1 h-6 bg-linear-to-r from-sky-500/15 to-purple-500/15 text-white/80 border-transparent">{t}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Longer Page Content: Example Prompt Template */}
        <Card className="mt-2">
          <CardHeader>
            <CardTitle>Example Prompt Template</CardTitle>
            <CardDescription>Use this as a starting point and tweak styles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground">
              Visual Style: photorealistic landscape, soft depth of field, high dynamic range
              <br />
              Composition: centered subject, leading lines, rule of thirds, minimal clutter
              <br />
              Lighting: golden hour glow, subtle rim light, gentle shadows
              <br />
              Colors: earthy greens and warm ambers, slightly desaturated
              <br />
              Texture: fine mist, light haze over distant trees
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setPrompt("A serene forest landscape with mist and golden-hour light. Visual Style: photorealistic, soft DOF. Composition: centered subject, leading lines. Lighting: golden hour glow, rim light. Colors: earthy greens, warm ambers.")}
              >
                Prompt
              </Button>
              <Button
                onClick={() => setPrompt((p) => p ? p + "\n\nAdd: gentle fog in distance, faint sunbeams through canopy." : "A serene forest landscape with mist and golden-hour light. Add: gentle fog in distance, faint sunbeams through canopy.")}
              >
                Create Similar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
