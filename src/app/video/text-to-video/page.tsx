"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Loader2, Star, X, CheckCircle2, Clock, Tv, Maximize2 } from "lucide-react";
import { models } from "@/data/models";
import { API_BASE } from "@/lib/config";
import { VideoSidebar } from "@/components/video-sidebar";
import { Input } from "@/components/ui/input";

// preview video helpers
const videoFiles = [
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

// model card meta to match Image-to-Video overlay styling
type Meta = {
  maxDurationMin: number;
  supportedResolutions: string[];
  aspectRatios: string[];
  defaultDurationSec: number;
  tags: string[];
};
const defaultMeta: Meta = {
  maxDurationMin: 8,
  supportedResolutions: ["720p"],
  aspectRatios: ["16:9", "9:16"],
  defaultDurationSec: 5,
  tags: [],
};
const modelMeta: Record<string, Meta> = {
  "wan-25": { maxDurationMin: 8, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["First Frame", "Last Frame", "Turbo Speed", "Balanced"] },
  "veo-3": { maxDurationMin: 10, supportedResolutions: ["1080p", "4K"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Cinematic", "Motion Canvas", "Camera Control"] },
  "sora-2": { maxDurationMin: 30, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 10, tags: ["Hyper-Realistic", "Immersive Visuals"] },
  "seedance-1p": { maxDurationMin: 3, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Fast", "First Frame", "Motion Focus"] },
  "kling-v2": { maxDurationMin: 10, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 10, tags: ["Motion Dynamics", "Scene Consistency"] },
  "hailuo": { maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 6, tags: ["Stylized", "Creative"] },
  "veo3-fast": { maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 5, tags: ["Fast", "Iteration"] },
};

const videoModels = models.filter((m) => m.category === "video");

export default function TextToVideoPage() {
  const [modelId, setModelId] = useState<string>(videoModels[0]?.id || "");
  const SAMPLE_PROMPT = "Prompt: Visual Style: [realistic / cinematic / anime / 3D / flat illustration / minimal / documentary] Camera Style: [smooth motion / handheld / static / dynamic cuts] Lighting: [soft daylight / dramatic contrast / neon / studio lighting] Voice: Gender: [male / female / neutral] Tone: [calm / enthusiastic / emotional / professional / storyteller] Accent: [American / British / Australian / Neutral] Speed: [slow / medium / fast] Music & Sound Effects: Background Music: [genre, mood, tempo] Sound Effects: [optional — footsteps, ambient, keyboard, ocean waves, etc.]";
  const [prompt, setPrompt] = useState<string>(SAMPLE_PROMPT);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>("");
  const [safetyCheck, setSafetyCheck] = useState<boolean>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);

  const selectedModelData = videoModels.find((m) => m.id === modelId);
  // Add overlay UI state
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = showModelPanel ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showModelPanel]);

  async function handleGenerate() {
    if (!modelId || !prompt.trim()) {
      setError("Please select a model and enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError("");
    setResult("");

    try {
      const qs = new URLSearchParams({ prompt, model_id: modelId }).toString();
      const res = await fetch(`${API_BASE}/api/pipeline/text-to-video?${qs}`, { method: "POST" });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setResult(`Queued with model ${data.model_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during generation");
    } finally {
      setIsGenerating(false);
    }
  }

  function makeAutoPromptFromFilename(name: string, duration?: number) {
    const base = "Auto Prompt: ";
    const plain = name.replace(/\.[a-zA-Z0-9]+$/, "").replace(/[\-_]+/g, " ");
    const hints: string[] = [];
    if (/beach|sea|ocean|coast/i.test(plain)) hints.push("coastal scene, ocean waves, sunset tones");
    if (/city|urban|street/i.test(plain)) hints.push("urban vibes, neon lighting, dynamic cuts");
    if (/dog|pet|animal/i.test(plain)) hints.push("warm tone, pet-friendly mood, playful motion");
    if (/mountain|forest|nature|tree/i.test(plain)) hints.push("nature documentary style, soft daylight, slow camera");
    const durationPart = typeof duration === "number" && isFinite(duration) ? `, target length ~${Math.round(duration)}s` : "";
    const tags = hints.length ? `Style hints: ${hints.join("; ")}` : "Style hints: cinematic, balanced motion";
    return `${base}${plain}${durationPart}. ${tags}. ${SAMPLE_PROMPT}`;
  }

  async function handleSmartExpand() {
    if (!prompt.trim()) return;
    setIsExpanding(true);
    setError("");
    try {
      const res = await fetch("/api/prompt/expand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, model: "gpt-4o-mini", temperature: 0.7 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to expand prompt");
      setPrompt(String(data?.expanded || prompt));
    } catch (e: any) {
      setError(e?.message || "Prompt expansion failed");
    } finally {
      setIsExpanding(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        {/* Header removed per request */}

        <div className="grid lg:grid-cols-[1fr_1.4fr] xl:grid-cols-[1fr_1.6fr] gap-8">
          {/* Input */}
          <Card>
            <CardHeader>
              <CardTitle>Model & Prompt</CardTitle>
              <CardDescription>Select a model and write your prompt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                    <Badge variant="outline">Video</Badge>
                    {(selectedModelData.features || []).slice(0, 2).map((t) => (
                      <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Video Upload with auto prompt fill */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Video (optional)</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (!file) return;
                        const url = URL.createObjectURL(file);
                        setUploadedVideo(file);
                        setUploadedVideoUrl(url);
                        // Create a temporary video to read duration then build auto prompt
                        const temp = document.createElement('video');
                        temp.src = url;
                        temp.preload = 'metadata';
                        temp.onloadedmetadata = () => {
                          const dur = temp.duration;
                          setPrompt(makeAutoPromptFromFilename(file.name, isFinite(dur) ? dur : undefined));
                        };
                        // fallback immediately if metadata fails
                        temp.onerror = () => {
                          setPrompt(makeAutoPromptFromFilename(file.name));
                        };
                      }}
                      className="text-sm"
                    />
                    <div className="text-xs text-muted-foreground">MP4, MOV, WebM supported</div>
                  </div>
                </div>
              </div>

              {/* Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Prompt</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A cinematic aerial shot of a futuristic city at dusk..."
                  className="w-full min-h-[140px] px-3 py-2 border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleSmartExpand}
                  className="inline-flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-full border border-purple-400/40 bg-linear-to-r from-fuchsia-500/15 to-purple-500/15 hover:from-fuchsia-500/25 hover:to-purple-500/25"
                    disabled={isExpanding}
                    aria-label="Smart Expansion"
                  >
                    {isExpanding ? (
                      <span className="inline-block w-3 h-3 rounded-full border-2 border-purple-400 border-t-transparent animate-spin" />
                    ) : (
                      <span className="w-3 h-3 inline-block rounded-full bg-linear-to-r from-fuchsia-500 to-purple-500" />
                    )}
                    Smart Expansion
                  </button>
                  <span className="text-xs text-muted-foreground">{prompt.length}/1200</span>
                </div>
              </div>

              {/* Safety Checker */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Safety Checker</label>
                <input type="checkbox" checked={safetyCheck} onChange={(e) => setSafetyCheck(e.target.checked)} />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleGenerate} disabled={isGenerating || !modelId || !prompt.trim()} className="flex-1">
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Video
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={() => { setPrompt(""); setResult(""); setError(""); }}>
                  Clear
                </Button>
              </div>

              {/* Status */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview */}
          <div className="relative h-full">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Your result will appear below</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/30 rounded-lg overflow-hidden">
                  <video
                    src={uploadedVideoUrl || videoFiles[0]}
                    className="w-full h-full object-cover"
                    controls
                    playsInline
                  />
                </div>
              </CardContent>
            </Card>

            {/* Overlay Panel (constrained to Preview panel) */}
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
                    <Star className="w-4 h-4 text-orange-500" /> Popular Video Models ({videoModels.length})
                  </div>
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[1fr]">
                      {videoModels
                        .filter((m) => (m.name.toLowerCase().includes(searchQuery.toLowerCase())))
                        .map((m) => (
                          <div key={m.id} className="group h-full" onClick={() => { setModelId(m.id); setShowModelPanel(false); }}>
                            <div className="relative h-full flex flex-col rounded-2xl border border-purple-500/40 hover:border-purple-400 transition-all duration-200 cursor-pointer bg-neutral-900 text-neutral-100">
                              <div className="aspect-video rounded-t-2xl bg-muted/30 overflow-hidden relative">
                                {/* video preview is already injected above */}
                                <video
                                  key={`prev-${m.id}`}
                                  src={videoFiles[hashString(m.id) % videoFiles.length]}
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
                                {typeof m.credits === "number" && (
                                  <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-linear-to-r from-fuchsia-600 to-violet-600 text-white shadow">{m.credits} credits</div>
                                )}
                                <CheckCircle2 className={`${modelId === m.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'} absolute top-2 left-2 w-5 h-5 text-fuchsia-500 transition-opacity`} />
                              </div>
                              <div className="flex-1 p-4 flex flex-col">
                                <div className="text-base font-semibold flex items-center gap-2 mb-1"><Star className="w-4 h-4 text-orange-500" /> {m.name}{m.version ? ` v${m.version}` : ""}</div>
                                <div className="text-sm text-neutral-300 line-clamp-2 mb-3 leading-5">{m.description}</div>
                                {(() => { const meta = modelMeta[m.id] || defaultMeta; return (
                                  <div className="space-y-2 text-sm text-neutral-300">
                                    <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {meta.maxDurationMin}min</div>
                                    <div className="flex items-center gap-2"><Tv className="w-4 h-4" /> {meta.supportedResolutions.join(', ')}</div>
                                    <div className="flex items-center gap-2"><Maximize2 className="w-4 h-4" /> {meta.aspectRatios.join(', ')}</div>
                                    <div className="flex items-center gap-2"><Play className="w-4 h-4" /> {meta.defaultDurationSec}s</div>
                                  </div>
                                ); })()}
                                <div className="flex flex-wrap gap-1.5 mt-auto">
                                  {((modelMeta[m.id]?.tags || []).concat(m.features || [])).slice(0, 6).map((t) => (
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
        {/* Longer page content */}
        <div className="mt-8 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>ArtAny AI Text to Video Feature: Revolutionizing Content Creation</CardTitle>
              <CardDescription>
                Harness the power of Text to Video. Turn simple text into stunning videos, streamlining production and slashing costs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div>
                  <div className="rounded-xl border bg-muted/30 p-4">
                    <h3 className="font-semibold mb-3">Example Prompt Template</h3>
                    <pre className="text-sm whitespace-pre-wrap leading-relaxed">{`Visual Style: cinematic\nCamera Style: smooth motion\nLighting: soft daylight\n\nVoice:\n- Gender: male\n- Tone: professional\n- Accent: American\n- Speed: medium\n\nBackground Music: upbeat corporate\nSound Effects: subtle ambient`}</pre>
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        onClick={async () => {
                          setIsExpanding(true);
                          try {
                            const base = `Visual Style: cinematic\nCamera Style: smooth motion\nLighting: soft daylight\nVoice: Gender: male, Tone: professional, Accent: American, Speed: medium\nBackground Music: upbeat corporate, Sound Effects: subtle ambient`;
                            const res = await fetch('/api/prompt/expand', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ prompt: base, model: 'gpt-4o-mini' }),
                            });
                            const data = await res.json();
                            if (!res.ok) throw new Error(data?.error || 'Failed');
                            setPrompt(String(data?.expanded || base));
                          } catch (e: any) {
                            setError(e?.message || 'Expansion failed');
                          } finally {
                            setIsExpanding(false);
                          }
                        }}
                      >
                        Create Similar
                      </button>
                      <button
                        type="button"
                        className="px-4 py-2 rounded-lg border"
                        onClick={() => setPrompt(SAMPLE_PROMPT)}
                      >
                        Prompt
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="rounded-xl overflow-hidden border">
                    <video src={uploadedVideoUrl || videoFiles[0]} className="w-full h-full object-cover" controls />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    );
  }
