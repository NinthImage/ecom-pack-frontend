"use client";

import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { FileText, Sparkles, Copy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedLogo from "@/components/animated-logo";

export default function PromptGeneratorPage() {
  const [topic, setTopic] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [outputJson, setOutputJson] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [format, setFormat] = useState<"prompt" | "text" | "json" | "other">("prompt");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formula, setFormula] = useState<"basic" | "advanced" | "camera" | "transformation">("basic");
  const [language, setLanguage] = useState<"english" | "chinese">("english");
  const [provider, setProvider] = useState<"openai" | "google">("openai");
  const [bgSpec, setBgSpec] = useState<any | null>(null);
  const [isBgLoading, setIsBgLoading] = useState<boolean>(false);

  function formulaInstructions(): string {
    switch (formula) {
      case "advanced":
        return "Use advanced style detail: include lens type, focal length, post-processing, grading, and scene mood.";
      case "camera":
        return "Emphasize camera movement requirements (panning, tilting, dolly, rotation), shot type, and pacing.";
      case "transformation":
        return "Describe transformation effects (morphing, time-lapse, style transfer) and how they evolve across the scene.";
      default:
        return "Use a clear basic cinematic style with composition, lighting, colors, and texture.";
    }
  }

  async function generatePrompt() {
    if (!topic.trim()) return;
    try {
      setIsLoading(true);
      setCopied(false);
      setOutput("");
      setOutputJson(null);
      const res = await fetch("/api/prompt/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: topic, format, instructions: formulaInstructions(), language, provider }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Generate API error:", data?.error);
        alert(data?.error || "Failed to generate. Check OPENAI_API_KEY.");
        return;
      }
      if (format === "json" && data?.json) {
        setOutputJson(data.json);
        setOutput(JSON.stringify(data.json, null, 2));
      } else {
        setOutput(String(data?.text || ""));
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate. See console for details.");
    } finally {
      setIsLoading(false);
    }
  }

  async function generateBackground(style: "gradient" | "pattern" | "photo" = "gradient") {
    if (!topic.trim()) return;
    try {
      setIsBgLoading(true);
      setBgSpec(null);
      const res = await fetch("/api/image/background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: topic, style, provider, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Background API error:", data?.error);
        alert(data?.error || "Failed to generate background.");
        return;
      }
      setBgSpec(data?.json || null);
      if (data?.text && !data?.json) {
        // If provider returned raw text
        setBgSpec({ raw: data.text });
      }
    } catch (e: any) {
      console.error(e);
      alert(e?.message || "Background generation failed");
    } finally {
      setIsBgLoading(false);
    }
  }
  
  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        {/* Top two-panel layout matching screenshots */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: AI Prompt Generator */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>AI Prompt Generator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Select prompt formula */}
                <div>
                  <label className="text-sm font-medium">Select prompt formula</label>
                  <select
                    value={formula}
                    onChange={(e) => setFormula(e.target.value as any)}
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="basic">Basic Formula</option>
                    <option value="advanced">Advanced Formula</option>
                    <option value="camera">Camera Movement Formula</option>
                    <option value="transformation">Transformation Formula</option>
                  </select>
                </div>

                {/* Select output language */}
                <div>
                  <div className="text-sm font-medium">Select output language</div>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="language"
                        value="english"
                        checked={language === "english"}
                        onChange={() => setLanguage("english")}
                      />
                      English
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="language"
                        value="chinese"
                        checked={language === "chinese"}
                        onChange={() => setLanguage("chinese")}
                      />
                      Chinese
                    </label>
                  </div>
                </div>

                {/* Select provider */}
                <div>
                  <div className="text-sm font-medium">Select provider</div>
                  <div className="mt-2 flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="provider"
                        value="openai"
                        checked={provider === "openai"}
                        onChange={() => setProvider("openai")}
                      />
                      OpenAI
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="provider"
                        value="google"
                        checked={provider === "google"}
                        onChange={() => setProvider("google")}
                      />
                      Gemini
                    </label>
                  </div>
                </div>

                {/* Enter your idea */}
                <div>
                  <label className="text-sm font-medium">Enter your idea</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe the video content you want to generate..."
                    className="mt-1 w-full min-h-[120px] px-3 py-2 border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>

                {/* Output format selector */}
                <div>
                  <div className="text-sm font-medium mb-2">Output format</div>
                  <div className="flex flex-wrap gap-2">
                    {(["prompt", "text", "json", "other"] as const).map((f) => (
                      <Button
                        key={f}
                        variant={format === f ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFormat(f)}
                      >
                        {f.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={generatePrompt}
                  disabled={isLoading || !topic.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            {/* Right: Generated Result */}
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated Result</CardTitle>
                <div className="flex items-center gap-2">
                  {/* Quick access AI tools icon */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="rounded-full" aria-label="Quick AI tools">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Quick Access</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.location.assign('/image')}>Image Generator</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.assign('/video/text-to-video')}>Text to Video</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.assign('/video/image-to-video')}>Image to Video</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.location.assign('/tools/avatar')}>AI Avatar</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => window.open('https://krea.ai/', '_blank')}>Krea (Generate Portrait)</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Header copy icon */}
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Copy result"
                    onClick={() => {
                      if (output) {
                        navigator.clipboard.writeText(output);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    disabled={!output}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[240px] rounded-xl border bg-muted/30 p-4 font-medium">
                  {output ? (
                    format === "json" ? (
                      <pre className="text-xs whitespace-pre-wrap">{output}</pre>
                    ) : (
                      output
                    )
                  ) : (
                    <div className="text-muted-foreground">Enter your idea on the left and generate a prompt.</div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant={copied ? "default" : "outline"}
                  onClick={() => {
                    if (output) {
                      navigator.clipboard.writeText(output);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}
                  disabled={!output}
                  className={`w-full ${copied ? "bg-linear-to-r from-green-600 to-emerald-600" : ""}`}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Background generation result */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <Card className="shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Background Spec</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={isBgLoading || !topic.trim()} onClick={() => generateBackground("gradient")}>Gradient</Button>
                  <Button variant="outline" size="sm" disabled={isBgLoading || !topic.trim()} onClick={() => generateBackground("pattern")}>Pattern</Button>
                  <Button variant="outline" size="sm" disabled={isBgLoading || !topic.trim()} onClick={() => generateBackground("photo")}>Photo Prompt</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[200px] rounded-xl border bg-muted/30 p-4">
                  {isBgLoading ? (
                    <div className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" /> Generating background spec...</div>
                  ) : bgSpec ? (
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(bgSpec, null, 2)}</pre>
                  ) : (
                    <div className="text-sm text-muted-foreground">Choose a type to generate a background spec. Provider: {provider === "google" ? "Gemini" : "OpenAI"}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Marketing sections similar to screenshots */}
          <div className="mt-10 space-y-8">
            <section className="text-center">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                <span className="bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  AI Prompt Generator
                </span>
                <span className="block mt-2 text-foreground">Unlock the Power of AI Creativity</span>
              </h2>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <span className="px-2.5 py-1 text-xs rounded-full border bg-muted/40">Free Tool</span>
                <span className="px-2.5 py-1 text-xs rounded-full border bg-muted/40">No Login Required</span>
                <span className="px-2.5 py-1 text-xs rounded-full border bg-muted/40">Text & JSON Output</span>
              </div>
              <p className="mt-4 text-muted-foreground max-w-3xl mx-auto">
                Bridge the gap between imagination and AI. Craft clear, expressive prompts for visuals, stories, and video scenes—ready for your favorite generators.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Button onClick={() => { const el = document.getElementById('generator'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                  Generate Prompt
                </Button>
                <Button variant="outline" onClick={() => window.location.assign('/tools')}>Explore Tools</Button>
              </div>
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="relative rounded-2xl h-56 border bg-muted/30 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatedLogo size={96} showText={false} />
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs font-medium bg-background/80 backdrop-blur rounded-md px-2 py-1 border">Prompt → JSON Structure</div>
                </div>
                <div className="relative rounded-2xl h-56 border bg-muted/30 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AnimatedLogo size={96} showText={false} />
                  </div>
                  <div className="absolute bottom-3 left-3 text-xs font-medium bg-background/80 backdrop-blur rounded-md px-2 py-1 border">Prompt → Rich Text</div>
                </div>
              </div>
            </section>

            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold mb-2">Creative Writing Prompt Generator AI: Turn Inspiration into Words</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Generate opening hooks and narrative ideas</li>
                <li>Build character prompts and conflicts</li>
                <li>Feed complete prompts into your favorite AI writing tools</li>
              </ul>
            </div>

            <div className="rounded-2xl border p-6">
              <h3 className="text-xl font-semibold mb-2">Free AI Video Prompt Generator: Writing for the Screen</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>Detects camera moves like panning, zooming, rotation</li>
                <li>Suggests cues and beats based on tone</li>
                <li>Compatible with major AI Video platforms</li>
                <li>100% free, no login required</li>
              </ul>
              <div className="mt-4">
                <Button>Try AI Video Generator</Button>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Free AI Image Prompt Generator: The Art of Perfect Descriptions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="rounded-xl h-40 bg-muted/30" />
                <div className="rounded-xl h-40 bg-muted/30" />
                <div className="rounded-xl h-40 bg-muted/30" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
