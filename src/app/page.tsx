"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Video, Image as ImageIcon, Wand2, Play, Star, Users, Zap } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { assetUrl } from "@/lib/assets";


export default function HomePage() {
  const videos = [
    assetUrl("/videos/869084d9b9e64d5786d823a3bf180607.mp4"),
    assetUrl("/videos/kling_20251024_Text_to_Video_____prompt_1040_0.mp4"),
    assetUrl("/videos/kling_20251024_Text_to_Video_A_vibrant__860_0.mp4")
  ];
  const posters = [assetUrl("/next.svg"), assetUrl("/vercel.svg"), assetUrl("/globe.svg")];
  const videoRefs = useRef<HTMLVideoElement[]>([]);
  const [currentVideo, setCurrentVideo] = useState(0);

  useEffect(() => {
    // Attempt to autoplay all videos as soon as possible
    videoRefs.current.forEach((vid) => {
      if (!vid) return;
      try {
        vid.muted = true;
        // playsInline property is not settable in all browsers, but ensure if available
        // @ts-ignore
        vid.playsInline = true;
        vid.load();
        const p = vid.play();
        if (p && typeof p.then === 'function') p.catch(() => {});
        const start = () => {
          const p2 = vid.play();
          if (p2 && typeof p2.then === 'function') p2.catch(() => {});
        };
        vid.addEventListener("canplay", start, { once: true });
        vid.addEventListener("loadeddata", start, { once: true });
      } catch {}
    });
    const id = setInterval(() => {
      setCurrentVideo((prev) => (prev + 1) % videos.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-20">


      {/* Hero Section - ArtAny.ai Clone */}
      <section className="relative text-center overflow-hidden min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
        {/* Video background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {videos.map((src, i) => (
            <video
              key={src}
              src={src}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={posters[i]}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${currentVideo === i ? "opacity-100" : "opacity-0"}`}
              style={{ zIndex: 1 }}
              ref={(el) => { if (el) videoRefs.current[i] = el; }}
            />
          ))}
          <div className="absolute inset-0 bg-black/30 dark:bg-black/30" style={{zIndex: 2}} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 md:px-8" style={{zIndex: 3}}>
            <h1 className="liquid-text text-3xl md:text-5xl font-medium tracking-wide">
              AI Art Generator
            </h1>
            <p className="mt-3 text-white/85 md:text-lg">
              All the best AI models & Art solutions in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 px-6 md:px-8 py-3 md:py-4 text-lg font-medium">
                <Link href="/video/text-to-video">
                  <Video className="mr-2 h-5 w-5" />
                  Create Video
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20 px-6 md:px-8 py-3 md:py-4 text-lg font-medium">
                <Link href="/image">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Create Image
                </Link>
              </Button>
            </div>
            {/* Social proof badges */}
            <div className="mt-4 flex flex-wrap gap-3 justify-center">
              <Badge variant="secondary" className="bg-white/10 text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                4.9/5 rating
              </Badge>
              <Badge variant="secondary" className="bg-white/10 text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-300" />
                1M+ creators
              </Badge>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary" className="bg-white/10 text-white">Flux</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Veo</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Sora</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Kling</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Seedream</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Seedance</Badge>
              <Badge variant="secondary" className="bg-white/10 text-white">Nano Banana</Badge>
            </div>
          </div>
        </div>

        <style jsx>{`
          .liquid-text {
            background: linear-gradient(90deg,
              rgba(255,255,255,0.95),
              rgba(255,255,255,0.6),
              rgba(255,255,255,0.95)
            );
            background-size: 200% 100%;
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            animation: liquid-move 6s ease-in-out infinite;
            text-shadow: 0 2px 10px rgba(0,0,0,0.35);
          }
          @keyframes liquid-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          :global(.animate-gradient) {
            background-size: 200% auto;
            animation: gradient-flow 6s linear infinite;
          }
          @keyframes gradient-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </section>

      {/* Trust logos band under hero */}
      <section className="py-8">
        <div className="container max-w-7xl mx-auto px-4 md:px-8" data-reveal>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-80">
            <img src="/vercel.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/next.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/globe.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/window.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/file.svg" alt="Brand" className="h-6 md:h-8" />
          </div>
        </div>
      </section>

      {/* Overview + Quote Banner (below hero) */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-8" data-reveal>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">What is NinthImage AI Art Generator?</h2>
            <p className="text-muted-foreground max-w-4xl mx-auto">NinthImage integrates advanced AI models to quickly transform your ideas into unique artwork, making creation simple and enjoyable.</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-r from-violet-700/60 via-purple-700/50 to-fuchsia-600/50 p-6 md:p-8 border border-white/10 shadow-lg" data-reveal>
            <p className="text-white/90 text-base md:text-lg text-center italic">The NinthImage AI Art Generator is a game‑changer for someone like me! I’ve always had a head full of ideas but zero skills to bring them to life. This tool literally handed me the brush to paint my imagination. Thank you for finally making me feel like a true creator!</p>
            <div className="mt-4 text-center text-sm text-white/80">— @Emily Rodriguez —</div>
          </div>
        </div>
      </section>

      {/* AI Art Generation Features */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-start gap-12">
            {/* Left: stacked art cards visual */}
            <div className="relative md:w-1/2 w-full min-h-[420px]" data-reveal>
              <div className="absolute left-2 top-12 w-40 h-64 rounded-3xl rotate-[-10deg] bg-gradient-to-br from-amber-500/60 to-orange-400/60 shadow-2xl blur-[0.3px]" />
              <div className="absolute left-32 top-2 w-44 h-72 rounded-3xl rotate-[12deg] bg-gradient-to-br from-blue-500/60 to-cyan-400/60 shadow-2xl" />
              <div className="relative z-10 mx-auto w-[320px] md:w-[420px] rounded-3xl overflow-hidden ring-1 ring-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] bg-black/40">
                <img src={assetUrl("/globe.svg")} alt="AI art card" className="w-full h-[420px] object-cover bg-black/60" loading="lazy" />
              </div>
            </div>

            {/* Right: section header, feature cards, and CTA buttons */}
            <div className="md:w-1/2 w-full">
              <div className="flex items-center gap-3 mb-6" data-reveal>
                <span className="inline-flex w-8 h-8 rounded-full bg-violet-500/20 border border-violet-400/30" />
                <h3 className="text-3xl font-bold">AI Art Generation Features</h3>
              </div>

              <div className="space-y-6" data-reveal>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="font-semibold text-white">More AI models than anywhere else</h4>
                  <p className="mt-2 text-white/80">Choose from Flux, Seedream, Seedance, Seedream, Nano Banana, Veo, Sora AI and many more AI image and video models.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="font-semibold text-white">Web and mobile AI generators</h4>
                  <p className="mt-2 text-white/80">Create high quality AI generated images from your laptop, tablet or mobile and sync them across your devices.</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <h4 className="font-semibold text-white">Free to use</h4>
                  <p className="mt-2 text-white/80">Get free credits when you join, and earn more by inviting friends to our creative community.</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4" data-reveal>
                <a href="/create" className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:brightness-110 transition">Start Your Artistic Creation →</a>
                <a href="/models" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition">Explore More AI Models</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending AI Models */}
      <section className="py-20">
        <div className="container max-w-7xl mx-auto px-4 md:px-8" data-reveal>
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h3 className="text-lg md:text-xl font-semibold">Trending AI Models</h3>
            <Link href="/models" className="text-sm text-primary hover:underline flex items-center">View all <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </div>
          <div className="overflow-x-auto snap-x snap-mandatory">
            <div className="flex gap-3 md:gap-4 min-w-max">
              {[
                {name: "Flux", slug: "flux", color: "from-indigo-500 to-purple-500"},
                {name: "Veo", slug: "veo", color: "from-blue-500 to-cyan-500"},
                {name: "Sora", slug: "sora", color: "from-pink-500 to-rose-500"},
                {name: "Kling", slug: "kling", color: "from-emerald-500 to-teal-500"},
                {name: "Seedream", slug: "seedream", color: "from-violet-500 to-fuchsia-500"},
                {name: "Seedance", slug: "seedance", color: "from-orange-500 to-amber-500"},
                {name: "Nano Banana", slug: "nano-banana", color: "from-lime-500 to-green-500"},
              ].map((m) => (
                <Link key={m.name} href={`/models/${m.slug}`} className="snap-start flex items-center gap-2 px-3 py-2 border rounded-lg bg-background/50 hover:bg-background/70 transition-colors">
                  <div className={`h-5 w-5 rounded bg-linear-to-br ${m.color}`} />
                  <span className="text-sm font-medium">{m.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-10" data-reveal>
            <h3 className="text-3xl font-bold">How it works</h3>
            <p className="text-muted-foreground">Create images and videos in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8" data-reveal>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500" /> Choose a model</CardTitle>
                <CardDescription>Select from Flux, Veo, Sora, Kling and more</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Pick the best model for your task and style.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Wand2 className="w-5 h-5 text-emerald-500" /> Write a prompt</CardTitle>
                <CardDescription>Describe what you want to create</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Use our prompt helper to craft better prompts.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Play className="w-5 h-5 text-blue-500" /> Generate & refine</CardTitle>
                <CardDescription>Preview, upscale, and export your results</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Iterate quickly with fast previews and fine‑tuning tools.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-10" data-reveal>
            <h3 className="text-3xl font-bold">Creators love NinthImage</h3>
            <p className="text-muted-foreground">Trusted by artists, designers, and content creators</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8" data-reveal>
            {[
              {name: "Ava R.", role: "Digital Artist", quote: "The model selection is unmatched. I can get the exact vibe I want."},
              {name: "Leo M.", role: "Motion Designer", quote: "Fast previews and refined controls make editing a breeze."},
              {name: "Maya K.", role: "Content Creator", quote: "It’s the easiest way to create scroll‑stopping visuals."},
            ].map((t) => (
              <Card key={t.name} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/90">“{t.quote}”</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-8" data-reveal>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-80">
            <img src="/vercel.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/next.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/globe.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/window.svg" alt="Brand" className="h-6 md:h-8" />
            <img src="/file.svg" alt="Brand" className="h-6 md:h-8" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center space-y-3 mb-10" data-reveal>
            <h3 className="text-3xl font-bold">Frequently asked questions</h3>
            <p className="text-muted-foreground">Answers to common questions about NinthImage</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6" data-reveal>
            <details className="group border rounded-lg p-4 bg-background/50">
              <summary className="cursor-pointer font-medium flex items-center justify-between">
                Which models are supported?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">Flux, Veo, Sora, Kling, Seedream, Seedance, Nano Banana and more.</p>
            </details>
            <details className="group border rounded-lg p-4 bg-background/50">
              <summary className="cursor-pointer font-medium flex items-center justify-between">
                Is it free to use?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">Yes, you get free credits when you join and can earn more via invites.</p>
            </details>
            <details className="group border rounded-lg p-4 bg-background/50">
              <summary className="cursor-pointer font-medium flex items-center justify-between">
                Do you have mobile support?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">Yes, create on web and mobile with sync across devices.</p>
            </details>
            <details className="group border rounded-lg p-4 bg-background/50">
              <summary className="cursor-pointer font-medium flex items-center justify-between">
                Can I export high‑res images and videos?
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="mt-2 text-sm text-muted-foreground">Absolutely. Upscale, refine, and export in high resolution.</p>
            </details>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-24">
        <div className="container max-w-7xl mx-auto px-4 md:px-8 text-center" data-reveal>
          <div className="space-y-3">
            <h3 className="text-3xl font-bold">Start creating today</h3>
            <p className="text-muted-foreground">Free credits when you join. Upgrade anytime.</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/video/text-to-video">Create Video</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/image">Create Image</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="flex items-center">
              <Link href="/pricing">See Pricing <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
