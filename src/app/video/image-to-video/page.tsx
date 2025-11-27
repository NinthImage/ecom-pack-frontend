"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Play, Loader2, Video, Wand2, X, Star, Clock, Tv, Maximize2, CheckCircle2 } from "lucide-react";
import { API_BASE } from "@/lib/config";
import { VideoSidebar } from "@/components/video-sidebar";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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

const models = [
  { id: "wan-22-turbo", name: "Wan2.2 Turbo", credits: 130, description: "Fast image-to-video with optimized speed and realism.", maxDurationMin: 8, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["First Frame", "Last Frame", "Turbo Speed", "Balanced"] },
  { id: "wan-25-img2video", name: "Wan2.5 Image to Video", credits: 140, description: "Combines image input with text processing to create synchronized video content.", maxDurationMin: 8, supportedResolutions: ["480p", "720p", "1080p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Seed", "First Frame", "Image Sync", "Text Integration", "Talking Head"] },
  { id: "kling-25-pro", name: "Kling2.5 Pro", credits: 230, description: "Professional-grade conversion with exceptional detail preservation.", maxDurationMin: 10, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 10, tags: ["First Frame", "Kling AI", "Pro Quality", "Exceptional Detail", "Realistic Motion"] },
  { id: "sora-2", name: "Sora2", credits: 130, description: "Hyper-realistic visuals and immersive motion.", maxDurationMin: 30, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 10, tags: ["First Frame", "Hyper-Realistic", "Immersive Visuals", "Audio Generation"] },
  { id: "stable-video-diffusion", name: "Stable Video Diffusion", credits: 50, description: "Smooth animations from static images.", maxDurationMin: 5, supportedResolutions: ["720p"], aspectRatios: ["16:9", "1:1"], defaultDurationSec: 5, tags: ["Balanced", "Style Preserve"] },
  { id: "runway-gen2", name: "Runware Gen-2", credits: 100, description: "Professional motion control with high fidelity.", maxDurationMin: 10, supportedResolutions: ["720p", "1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Pro Quality", "Motion Control"] },
  { id: "pika-labs", name: "Pika Labs", credits: 80, description: "Creative animation with style preservation.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 6, tags: ["Creative", "Style Preserve"] },
  { id: "genmo-vid", name: "Genmo Vid", credits: 90, description: "Generative motion with smart expansion.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 6, tags: ["Smart Expansion", "Realistic Motion"] },
  { id: "google-lumiere", name: "Lumiere", credits: 200, description: "Cinematic frames with consistent motion.", maxDurationMin: 10, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Cinematic", "Consistent Motion"] },
  { id: "animate-diff", name: "AnimateDiff", credits: 60, description: "Lightweight image animation.", maxDurationMin: 3, supportedResolutions: ["720p"], aspectRatios: ["1:1", "16:9"], defaultDurationSec: 5, tags: ["Fast", "Light"] },
  { id: "luma-dream", name: "LumaDream", credits: 110, description: "Dreamlike motion with high detail.", maxDurationMin: 10, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Dreamlike", "Detail"] },
  { id: "vid-xl", name: "VidXL", credits: 120, description: "Large-scale video synthesis engine.", maxDurationMin: 15, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Scale", "Stable"] },
  { id: "pix-flow", name: "PixFlow", credits: 85, description: "Fluid motion from single frames.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Fluid", "First Frame"] },
  { id: "motion-forge", name: "MotionForge", credits: 95, description: "Forged motion with balanced speed.", maxDurationMin: 8, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 6, tags: ["Balanced", "Realistic Motion"] },
  { id: "frame-sync", name: "FrameSync", credits: 70, description: "Frame-consistent generation.", maxDurationMin: 5, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 5, tags: ["Frame Sync", "Consistent"] },
  { id: "real-motion", name: "RealMotion", credits: 100, description: "High realism motion engine.", maxDurationMin: 10, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Realistic Motion", "Pro Quality"] },
  { id: "hyper-vid", name: "HyperVid", credits: 90, description: "Hyper-visual effects.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 6, tags: ["Hyper-Realistic", "FX"] },
  { id: "ultra-frame", name: "UltraFrame", credits: 150, description: "Ultra-stable frames across motion.", maxDurationMin: 20, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Ultra", "Stable"] },
  { id: "dream-video", name: "DreamVideo", credits: 75, description: "Soft, cinematic motion.", maxDurationMin: 8, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 6, tags: ["Soft", "Cinematic"] },
  { id: "nova-vid", name: "NovaVid", credits: 80, description: "Bright visual motion.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 6, tags: ["Bright", "Fast"] },
  { id: "flux-vid", name: "FluxVid", credits: 70, description: "Flux-based dynamics.", maxDurationMin: 5, supportedResolutions: ["720p"], aspectRatios: ["16:9", "1:1"], defaultDurationSec: 5, tags: ["Dynamic", "Flux"] },
  { id: "aivo-11", name: "Aivo 1.1", credits: 65, description: "AI-driven motion.", maxDurationMin: 5, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 5, tags: ["AI", "Motion"] },
  { id: "cam-ctrl-pro", name: "CamCtrl Pro", credits: 180, description: "Precise camera control.", maxDurationMin: 12, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Camera Control", "Pro Quality"] },
  { id: "text-sync", name: "TextSync", credits: 85, description: "Text-image sync.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["9:16", "16:9"], defaultDurationSec: 6, tags: ["Text Integration", "Image Sync"] },
  { id: "talking-head", name: "Talking Head", credits: 120, description: "Talking head synthesis.", maxDurationMin: 10, supportedResolutions: ["1080p"], aspectRatios: ["9:16", "16:9"], defaultDurationSec: 10, tags: ["Talking Head", "First Frame"] },
  { id: "scene-craft", name: "SceneCraft", credits: 95, description: "Scene-focused generation.", maxDurationMin: 8, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 6, tags: ["Scene", "Realistic Motion"] },
  { id: "clip-gen", name: "ClipGen", credits: 60, description: "Quick clip generation.", maxDurationMin: 4, supportedResolutions: ["720p"], aspectRatios: ["1:1", "16:9"], defaultDurationSec: 5, tags: ["Quick", "Fast"] },
  { id: "edge-motion", name: "EdgeMotion", credits: 90, description: "Edge-sharp motion.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 6, tags: ["Sharp", "Detail"] },
  { id: "motion-canvas", name: "Motion Canvas", credits: 160, description: "Canvas-based motion control.", maxDurationMin: 12, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Motion Canvas", "Camera Control"] },
  { id: "veo-3", name: "Veo 3", credits: 1000, description: "Cinematic-grade with motion control.", maxDurationMin: 10, supportedResolutions: ["1080p", "4K"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Cinematic", "Motion Canvas", "Camera Control"] },
  { id: "seedance-pro", name: "Seedance 1.0 Pro", credits: 120, description: "Rapid short-form generation for social media.", maxDurationMin: 3, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Fast", "First Frame", "Motion Focus"] },
  { id: "phi-vid", name: "PhiVid", credits: 55, description: "Minimal video synthesis.", maxDurationMin: 4, supportedResolutions: ["720p"], aspectRatios: ["1:1", "16:9"], defaultDurationSec: 4, tags: ["Minimal", "Light"] },
  { id: "motion-lite", name: "MotionLite", credits: 50, description: "Lightweight but stable motion.", maxDurationMin: 4, supportedResolutions: ["720p"], aspectRatios: ["16:9"], defaultDurationSec: 4, tags: ["Light", "Stable"] },
  { id: "vgen-light", name: "VGen Light", credits: 70, description: "Balanced speed and quality.", maxDurationMin: 6, supportedResolutions: ["720p"], aspectRatios: ["16:9", "9:16"], defaultDurationSec: 5, tags: ["Balanced", "Quality"] },
  { id: "ultra-sync", name: "UltraSync", credits: 140, description: "Ultra-level sync across frames.", maxDurationMin: 15, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Ultra", "Sync"] },
  { id: "cine-flow", name: "CineFlow", credits: 130, description: "Cinematic flow control.", maxDurationMin: 12, supportedResolutions: ["1080p"], aspectRatios: ["16:9"], defaultDurationSec: 10, tags: ["Cinematic", "Flow"] },
];

export default function ImageToVideoPage() {
  const [selectedModel, setSelectedModel] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [prompt, setPrompt] = useState("");
  const [durationSec, setDurationSec] = useState<number>(5);
  const [resolution, setResolution] = useState<string>("720p");
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showModelPanel, setShowModelPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingModel, setPendingModel] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!selectedModel || !uploadedImage) {
      setError("Please select a model and upload an image");
      return;
    }

    setIsGenerating(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("model", selectedModel);
      formData.append("prompt", prompt);
      formData.append("durationSec", String(durationSec));
      formData.append("resolution", resolution);
      formData.append("aspectRatio", aspectRatio);

      const response = await fetch(`${API_BASE}/api/pipeline/image-to-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.message || "Video generation completed successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    setSelectedModel("");
    setUploadedImage(null);
    setImagePreview("");
    setPrompt("");
    setDurationSec(5);
    setResolution("720p");
    setAspectRatio("16:9");
    setResult("");
    setError("");
  };

  const selectedModelData = models.find(m => m.id === selectedModel);

  // Lock horizontal scroll globally; lock page scroll when overlay is open
  useEffect(() => {
    document.documentElement.style.overflowX = 'hidden';
    return () => { document.documentElement.style.overflowX = '' };
  }, []);
  useEffect(() => {
    document.body.style.overflow = showModelPanel ? 'hidden' : '';
  }, [showModelPanel]);

  return (
    <div className={`grid lg:grid-cols-[260px_1fr] gap-6 min-h-[calc(100vh-4rem)] overflow-x-hidden ${showModelPanel ? 'overflow-hidden' : ''}`}> 
      <VideoSidebar />
      <div className="space-y-8 h-[calc(100vh-4rem)] overflow-y-auto pr-2">
        {/* Header removed per request */}

        <div className="grid lg:grid-cols-[1fr_1.4fr] xl:grid-cols-[1fr_1.6fr] gap-8">
          {/* Input Section */}
          <Card id="main-input-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5" />
                Generate Video
              </CardTitle>
              <CardDescription>
                Upload an image and select a model to create an animated video
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                {/* Clickable selector that opens overlay instead of dropdown */}
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
                {/* Browse all models button removed per request */}
                {/* Overlay opens automatically when selecting from the left Select */}
                {selectedModelData && (
                  <p className="text-sm text-muted-foreground">
                    {selectedModelData.description}
                  </p>
                )}
              </div>

              {/* Settings: Duration, Resolution, Aspect Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Duration</label>
                  <select
                    value={durationSec}
                    onChange={(e) => setDurationSec(Number(e.target.value))}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {Array.from({ length: 10 }, (_, i) => (i + 1) * 5).map((s) => (
                      <option key={s} value={s}>{s}s</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Resolution</label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {(selectedModelData?.supportedResolutions || ["480p", "720p", "1080p"]).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    {(selectedModelData?.aspectRatios || ["16:9", "9:16", "1:1"]).map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Image</label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <Image 
                        src={imagePreview} 
                        alt="Uploaded preview" 
                        width={400}
                        height={192}
                        className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Change Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Click to upload an image</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Optional Prompt */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Motion Description (Optional)</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the motion you want to add (e.g., gentle swaying, flowing water, moving clouds)..."
                  className="w-full min-h-[100px] px-3 py-2 border border-input rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <div className="flex flex-wrap gap-2">
                  {["smooth pan left", "camera orbit 180°", "gentle sway", "parallax background", "cinematic slow‑mo"].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setPrompt((p) => p ? `${p} | ${chip}` : chip)}
                      className="px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !selectedModel || !uploadedImage}
                  className="flex-1"
                >
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
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              </div>

              {/* Status Messages */}
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            {result && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Video Preview with overlay */}
        <div className="relative h-full">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Video Preview
              </CardTitle>
              <CardDescription>Your generated video will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                    <div>
                      <p className="font-medium">Generating your video...</p>
                      <p className="text-sm text-muted-foreground">This may take a few minutes</p>
                    </div>
                  </div>
                ) : result ? (
                  <div className="text-center space-y-4">
                    <Video className="w-12 h-12 mx-auto text-green-500" />
                    <div>
                      <p className="font-medium">Video Queued!</p>
                      <p className="text-sm text-muted-foreground">Check back for the final render</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">Your preview appears here</div>
                )}
              </div>
            </CardContent>
          </Card>

          {showModelPanel && (
            <div className="absolute inset-0 z-40">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-lg" />
              <div className="absolute inset-0 w-full h-full bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
                 <div className="flex items-center justify-between p-4 border-b">
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
                        <div key={m.id} className="group h-full" onClick={() => { setPendingModel(m.id); setSelectedModel(m.id); setShowModelPanel(false); }}>
                           <div className="relative h-full flex flex-col rounded-2xl border border-purple-500/40 hover:border-purple-400 transition-all duration-200 cursor-pointer bg-neutral-900 text-neutral-100">
                               <div className="aspect-video rounded-t-2xl bg-muted/30 overflow-hidden relative">
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
                                 <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-[11px] font-medium bg-linear-to-r from-fuchsia-600 to-violet-600 text-white shadow">{m.credits} credits</div>
                                <CheckCircle2 className={`${(pendingModel ? pendingModel === m.id : selectedModel === m.id) ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'} absolute top-2 left-2 w-5 h-5 text-fuchsia-500 transition-opacity`} />
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

        {/* Additional informational sections temporarily removed to resolve parsing error */}

      </div>
      </div>
    </div>
  );
}
