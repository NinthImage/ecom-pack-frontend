"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Clock, Tv, Maximize2, Wand2, Play, Loader2, Image as ImageIcon, X, Star, CheckCircle2, Video as VideoIcon } from "lucide-react";

// Sample videos for previews in the selector and result demo
const previewVideos = [
  "/videos/869084d9b9e64d5786d823a3bf180607.mp4",
  "/videos/kling_20251024_Text_to_Video_A_vibrant__860_0.mp4",
  "/videos/kling_20251024_Text_to_Video_____prompt_1040_0.mp4",
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

// Minimal models data to power the selector overlay (cloned UX)
const models = [
  { id: "wan-22-animate", name: "Wan2.2 Animate", credits: 215, description: "Animate or replace content with seamless transitions.", maxDurationMin: 10, supportedResolutions: ["480p", "720p"], aspectRatios: ["16:9", "9:16", "1:1"], defaultDurationSec: 5, tags: ["Video Input", "Multi Images", "Replace", "Seamless Transition", "Content Replacement"] },
  { id: "wan-vace-outpaint", name: "Wan Vace Outpainting", credits: 680, description: "Outpainting extends content beyond original boundaries with visual consistency.", maxDurationMin: 10, supportedResolutions: ["480p", "720p"], aspectRatios: ["16:9", "9:16", "1:1"], defaultDurationSec: 5, tags: ["Seed", "Video Input", "Video Outpainting", "Seamless Expansion", "Visual Consistency"] },
  { id: "veo3-fast", name: "Veo3 Fast", credits: 120, description: "Fast edits with decent motion fidelity.", maxDurationMin: 8, supportedResolutions: ["480p", "720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Fast", "Balanced"] },
  { id: "pika-v4", name: "Pika v4", credits: 95, description: "Creative motion and style preserve.", maxDurationMin: 6, supportedResolutions: ["480p", "720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Creative", "Style Preserve"] },
];

export default function VideoEditorPage() {
  const [modelId, setModelId] = useState("wan-22-animate");
  const [mode, setMode] = useState<"replace" | "move">("replace");
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referenceImagePreview, setReferenceImagePreview] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [durationSec, setDurationSec] = useState(5);
  const [resolution, setResolution] = useState("480p");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [prompt, setPrompt] = useState("women dancing outpainting.");

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingModel, setPendingModel] = useState<string>("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      try {
        videoRef.current.muted = true;
        // @ts-ignore
        videoRef.current.playsInline = true;
        const p = videoRef.current.play();
        if (p && typeof p.then === "function") p.catch(() => {});
      } catch {}
    }
  }, [resultUrl]);

  const creditsCost = useMemo(() => {
    // lightweight placeholder logic matching screenshot ranges
    const base = resolution === "720p" ? 53 : resolution === "480p" ? 43 : 30;
    return base * (durationSec / 5);
  }, [resolution, durationSec]);

  const selectedModelData = models.find((m) => m.id === (pendingModel || modelId));

  // Match Image-to-Video page behaviors
  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    return () => { document.documentElement.style.overflowX = ''; };
  }, []);
  useEffect(() => {
    document.body.style.overflow = showModelPanel ? 'hidden' : '';
  }, [showModelPanel]);

  const handleReferenceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReferenceImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setReferenceImagePreview(String(ev.target?.result || ""));
    reader.readAsDataURL(file);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
  };

  const handleGenerate = async () => {
    setError("");
    if (!videoFile) {
      setError("Please upload a video to edit.");
      return;
    }
    setIsGenerating(true);
    // Simulate processing, then show a demo preview
    setTimeout(() => {
      const idx = Math.floor(Math.random() * previewVideos.length);
      setResultUrl(previewVideos[idx]);
      setIsGenerating(false);
    }, 1200);
  };

  const handleClear = () => {
    setReferenceImage(null);
    setReferenceImagePreview("");
    setVideoFile(null);
    setDurationSec(5);
    setResolution("480p");
    setAspectRatio("16:9");
    setPrompt("");
    setResultUrl("");
    setError("");
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Video AI</Badge>
            <Wand2 className="w-5 h-5 text-fuchsia-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">AI Video Editor</h1>
          <p className="text-muted-foreground">Replace or move subjects using a reference image and fine controls.</p>
        </section>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Model</CardTitle>
              <CardDescription>Select model and configure edit settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Model Selector (overlay) */}
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <div
                  role="button"
                  className="w-full inline-flex items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  onClick={() => setShowModelPanel(true)}
                  aria-label="Choose an AI model"
                >
                  <span className="truncate">{selectedModelData ? selectedModelData.name : "Choose an AI model"}</span>
                  <svg className="w-4 h-4 opacity-60" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {selectedModelData && (
                  <p className="text-sm text-muted-foreground">{selectedModelData.description}</p>
                )}
              </div>

              {/* Mode Chips */}
              <div className="flex gap-2">
                <Button variant={mode === "replace" ? "default" : "secondary"} onClick={() => setMode("replace")}>Replace</Button>
                <Button variant={mode === "move" ? "default" : "secondary"} onClick={() => setMode("move")}>Move</Button>
              </div>

              {/* Reference Images (max 1) */}
              <div>
                <p className="text-sm font-medium mb-2">Reference Images (Max 1 image)</p>
                <label className="border border-dashed rounded-lg h-28 flex items-center justify-center text-muted-foreground cursor-pointer">
                  <div className="flex items-center gap-2"><Upload className="w-4 h-4" /> Upload image</div>
                  <Input type="file" accept="image/*" className="hidden" onChange={handleReferenceImageUpload} />
                </label>
                {referenceImagePreview && (
                  <div className="mt-2 flex items-center gap-3">
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-sm">{referenceImage?.name}</span>
                  </div>
                )}
              </div>

              {/* Video Upload */}
              <div>
                <p className="text-sm font-medium mb-2">Video Upload</p>
                <label className="rounded-lg border bg-muted/30 h-12 px-3 flex items-center justify-between cursor-pointer">
                  <span className="text-sm text-muted-foreground">{videoFile ? videoFile.name : "Upload a video"}</span>
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <Input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                </label>
              </div>

              {/* Controls row */}
              <div className="grid grid-cols-3 gap-3">
                <Select value={String(durationSec)} onValueChange={(v) => setDurationSec(Number(v))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[5,10,15,20,30].map((d) => <SelectItem key={d} value={String(d)}>{d}s</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={resolution} onValueChange={setResolution}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["360p","480p","720p","1080p"]) .map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={aspectRatio} onValueChange={setAspectRatio}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["16:9","9:16","1:1","4:3"].map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Prompt */}
              <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Prompt (optional)" />

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button className="flex-1" onClick={handleGenerate} disabled={isGenerating}>
                  {isGenerating ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>) : (<><Play className="w-4 h-4 mr-2" /> Generate Video</>)}
                </Button>
                <Button variant="secondary" onClick={handleClear}>Clear</Button>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 mr-3"><Clock className="w-3 h-3" /> Max: 30s</span>
                <span className="inline-flex items-center gap-1 mr-3"><Tv className="w-3 h-3" /> {resolution}</span>
                <span className="inline-flex items-center gap-1"><Maximize2 className="w-3 h-3" /> {aspectRatio}</span>
                <span className="float-right">credits: {Math.round(creditsCost)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel (with local overlay like Image-to-Video) */}
          <div className="relative h-full">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><VideoIcon className="w-5 h-5" /> Preview</CardTitle>
                <CardDescription>Prompt: {prompt || "(none)"}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted/30">
                    {resultUrl ? (
                      <video ref={videoRef} src={resultUrl} className="absolute inset-0 w-full h-full object-cover" controls />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">Upload and Generate to preview</div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {referenceImagePreview && (
                      <div className="w-20 h-12 rounded overflow-hidden border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={referenceImagePreview} alt="ref" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="w-20 h-12 rounded overflow-hidden border bg-muted/30" />
                    <div className="w-20 h-12 rounded overflow-hidden border bg-muted/30" />
                    <Button size="sm" variant="secondary">Create</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showModelPanel && (
              <div className="absolute inset-0 z-40">
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg" />
                <div className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b bg-gray-50 dark:bg-neutral-800">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold">Model Selection</span>
                      <div className="w-full max-w-md">
                        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search models..." className="h-9 text-sm" />
                      </div>
                    </div>
                    <button className="rounded-md p-1.5 hover:bg-muted" aria-label="Close" onClick={() => setShowModelPanel(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="px-4 py-3 text-sm font-medium flex items-center gap-2 border-b bg-gray-50 dark:bg-neutral-800">
                    <Star className="w-4 h-4 text-orange-500" /> Popular Models ({models.length})
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                      {models
                        .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((m) => (
                          <div key={m.id} className="group h-full" onClick={() => { setPendingModel(m.id); setModelId(m.id); setShowModelPanel(false); }}>
                            <div className="relative h-full flex flex-col rounded-2xl border border-purple-500/40 hover:border-purple-400 transition-all duration-200 cursor-pointer bg-neutral-900 text-neutral-100">
                              <div className="aspect-video rounded-t-2xl bg-muted/30 overflow-hidden relative">
                                <video
                                  key={`prev-${m.id}`}
                                  src={previewVideos[hashString(m.id) % previewVideos.length]}
                                  muted
                                  autoPlay
                                  loop
                                  playsInline
                                  preload="metadata"
                                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:opacity-100 transition-opacity"
                                  onLoadedMetadata={(e) => {
                                    try {
                                      const offset = (hashString(m.id) % 5) + 0.5;
                                      if (isFinite(e.currentTarget.duration) && e.currentTarget.duration > offset) {
                                        e.currentTarget.currentTime = offset;
                                      }
                                    } catch {}
                                  }}
                                />
                                <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-linear-to-r from-fuchsia-600 to-violet-600 text-white shadow">{m.credits} credits</div>
                                <CheckCircle2 className={`${(pendingModel ? pendingModel === m.id : modelId === m.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'} absolute top-2 left-2 w-5 h-5 text-fuchsia-500 transition-opacity`} />
                              </div>
                              <div className="p-4 flex-1 flex flex-col">
                                <div className="text-base font-semibold flex items-center gap-2 mb-1"><Star className="w-4 h-4 text-orange-500" /> {m.name}</div>
                                <div className="text-sm text-neutral-300 line-clamp-2 mb-3 leading-5">{m.description}</div>
                                <div className="space-y-2 text-sm text-neutral-300">
                                  <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {m.maxDurationMin}min</div>
                                  <div className="flex items-center gap-2"><Tv className="w-4 h-4" /> {m.supportedResolutions.join(', ')}</div>
                                  <div className="flex items-center gap-2"><Maximize2 className="w-4 h-4" /> {m.aspectRatios.join(', ')}</div>
                                  <div className="flex items-center gap-2"><Play className="w-4 h-4" /> {m.defaultDurationSec}s</div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                  {m.tags?.map((t: string) => (
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
        </div>
      </div>
    </div>
  );
}
