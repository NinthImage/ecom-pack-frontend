"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search, Filter, Video, Image, Wand2, Star, Clock, Zap } from "lucide-react";
import Link from "next/link";

const videoFiles = [
  "/videos/869084d9b9e64d5786d823a3bf180607.mp4",
  "/videos/kling_20251024_Text_to_Video_A_vibrant__860_0.mp4",
  "/videos/kling_20251024_Text_to_Video_____prompt_1040_0.mp4",
];



// hashString moved to top

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

const models = [
  {
    id: "wan-2-2",
    name: "Wan 2.2",
    type: "Video",
    category: "video",
    badge: "HOT",
    badgeColor: "bg-red-500",
    credits: 100,
    description: "Advanced video generation with improved quality and faster processing",
    features: ["High Quality", "Fast Generation", "Multiple Styles"],
    rating: 4.9,
    generations: "2.1M",
    href: "/video/text-to-video"
  },
  {
    id: "veo-3",
    name: "Veo 3",
    type: "Video",
    category: "video",
    badge: "NEW",
    badgeColor: "bg-blue-500",
    credits: 1000,
    description: "Google's latest video generation model with unprecedented realism",
    features: ["Ultra Realistic", "Long Duration", "4K Output"],
    rating: 4.8,
    generations: "890K",
    href: "/video/text-to-video"
  },
  {
    id: "seedance-ai",
    name: "Seedance AI",
    type: "Video",
    category: "video",
    badge: "TRENDING",
    badgeColor: "bg-green-500",
    credits: 140,
    description: "Dance and movement specialized video generation",
    features: ["Dance Focused", "Motion Control", "Character Animation"],
    rating: 4.7,
    generations: "1.5M",
    href: "/video/text-to-video"
  },
  {
    id: "flux-kontext",
    name: "Flux Kontext",
    type: "Image",
    category: "image",
    badge: "POPULAR",
    badgeColor: "bg-purple-500",
    credits: 36,
    description: "Context-aware image generation with superior prompt understanding",
    features: ["Context Aware", "High Detail", "Style Control"],
    rating: 4.9,
    generations: "5.2M",
    href: "/image"
  },
  {
    id: "kling-ai-2-5",
    name: "Kling AI 2.5",
    type: "Video",
    category: "video",
    badge: "HOT",
    badgeColor: "bg-orange-500",
    credits: 230,
    description: "Chinese video generation model with excellent motion dynamics",
    features: ["Motion Dynamics", "Scene Consistency", "Text Integration"],
    rating: 4.6,
    generations: "980K",
    href: "/video/text-to-video"
  },
  {
    id: "imagen4-ultra",
    name: "Imagen4 Ultra",
    type: "Image",
    category: "image",
    badge: "NEW",
    badgeColor: "bg-indigo-500",
    credits: 40,
    description: "Google's most advanced image generation model",
    features: ["Photorealistic", "Text Rendering", "Fine Details"],
    rating: 4.8,
    generations: "3.1M",
    href: "/image"
  },
  {
    id: "ltxv-13b",
    name: "LTXV 13b",
    type: "Video",
    category: "video",
    badge: "FAST",
    badgeColor: "bg-cyan-500",
    credits: 230,
    description: "Lightning-fast video generation with 13B parameters",
    features: ["Ultra Fast", "Efficient", "Good Quality"],
    rating: 4.5,
    generations: "1.2M",
    href: "/video/text-to-video"
  },
  {
    id: "hunyuan-image-v3",
    name: "Hunyuan Image v3",
    type: "Image",
    category: "image",
    badge: "QUALITY",
    badgeColor: "bg-pink-500",
    credits: 26,
    description: "Tencent's high-quality image generation model",
    features: ["High Quality", "Asian Aesthetics", "Cultural Context"],
    rating: 4.7,
    generations: "2.8M",
    href: "/image"
  },
  {
    id: "sora-2",
    name: "Sora 2",
    type: "Video",
    category: "video",
    badge: "PREMIUM",
    badgeColor: "bg-yellow-500",
    credits: 2000,
    description: "OpenAI's revolutionary video generation model",
    features: ["Cinematic Quality", "Long Videos", "Complex Scenes"],
    rating: 5.0,
    generations: "450K",
    href: "/video/text-to-video"
  },
  {
    id: "flux-pro",
    name: "Flux Pro",
    type: "Image",
    category: "image",
    badge: "PRO",
    badgeColor: "bg-slate-500",
    credits: 50,
    description: "Professional-grade image generation for commercial use",
    features: ["Commercial License", "High Resolution", "Consistent Style"],
    rating: 4.8,
    generations: "4.5M",
    href: "/image"
  },
  {
    id: "runway-gen3",
    name: "Runware Gen-3",
    type: "Video",
    category: "video",
    badge: "CREATIVE",
    badgeColor: "bg-emerald-500",
    credits: 300,
    description: "Creative video generation with artistic flair",
    features: ["Artistic Style", "Creative Control", "Professional Output"],
    rating: 4.6,
    generations: "750K",
    href: "/video/text-to-video"
  },
  {
    id: "stable-diffusion-3-5",
    name: "Stable Diffusion 3.5",
    type: "Image",
    category: "image",
    badge: "OPEN",
    badgeColor: "bg-teal-500",
    credits: 20,
    description: "Open-source image generation with community support",
    features: ["Open Source", "Customizable", "Community Models"],
    rating: 4.4,
    generations: "8.9M",
    href: "/image"
  }
];

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredModels = models
    .filter(model => {
      const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          model.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || model.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.rating - a.rating;
        case "newest":
          return b.name.localeCompare(a.name);
        case "credits-low":
          return a.credits - b.credits;
        case "credits-high":
          return b.credits - a.credits;
        default:
          return 0;
      }
    });

  const getIcon = (type: string) => {
    switch (type) {
      case "Video":
        return <Video className="w-5 h-5" />;
      case "Image":
        return <Image className="w-5 h-5" />;
      default:
        return <Wand2 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">AI Models Catalog</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover and compare the latest AI models for video generation, image creation, and creative effects. 
          Choose the perfect model for your creative projects.
        </p>
      </section>

      {/* Filters and Search */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search models..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="video">Video Generation</SelectItem>
              <SelectItem value="image">Image Generation</SelectItem>
              <SelectItem value="effects">AI Effects</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="credits-low">Credits: Low to High</SelectItem>
              <SelectItem value="credits-high">Credits: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="cursor-pointer">
            <Star className="w-3 h-3 mr-1" />
            Top Rated
          </Badge>
          <Badge variant="secondary" className="cursor-pointer">
            <Zap className="w-3 h-3 mr-1" />
            Fast Generation
          </Badge>
          <Badge variant="secondary" className="cursor-pointer">
            <Clock className="w-3 h-3 mr-1" />
            Recently Added
          </Badge>
        </div>
      </section>

      {/* Models Grid */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map((model) => (
          <Card key={model.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(model.type)}
                  <CardTitle className="text-lg">{model.name}</CardTitle>
                </div>
                <Badge className={`${model.badgeColor} text-white text-xs`}>
                  {model.badge}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {model.description}
              </CardDescription>
            </CardHeader>
            
            {/* Video preview for video models */}
            {model.category === "video" && (
              <div className="px-4">
                <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10">
                  <video
                    src={videoFiles[hashString(model.id) % videoFiles.length]}
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full aspect-video object-cover bg-black"
                    onLoadedMetadata={(e) => {
                      const v = e.currentTarget as HTMLVideoElement;
                      try {
                        if (v.duration && isFinite(v.duration)) {
                          const offset = Math.random() * Math.min(5, Math.max(0, v.duration - 0.5));
                          v.currentTime = offset;
                        }
                      } catch {}
                    }}
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 text-xs rounded bg-black/60 text-white">Preview</div>
                </div>
              </div>
            )}

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Credits</span>
                <span className="font-semibold text-primary">{model.credits}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span>{model.rating}</span>
                </div>
                <span className="text-muted-foreground">{model.generations} generations</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {model.features.slice(0, 2).map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <Button asChild className="w-full group-hover:bg-primary/90">
                <Link href={model.href}>
                  Try {model.name} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full mt-2">
                <Link href={`/models/${model.id}`}>
                  Details
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* No Results */}
      {filteredModels.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No models found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button onClick={() => {
            setSearchQuery("");
            setCategoryFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Stats */}
      <section className="bg-muted/30 rounded-3xl p-8 text-center">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-primary">{models.length}+</h3>
            <p className="text-muted-foreground">AI Models Available</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">25M+</h3>
            <p className="text-muted-foreground">Total Generations</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-primary">99.9%</h3>
            <p className="text-muted-foreground">Uptime Guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
}

// helpers moved to top
