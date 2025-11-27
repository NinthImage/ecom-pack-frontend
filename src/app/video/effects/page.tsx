"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wand2, Clock, CreditCard, Flame } from "lucide-react";

type EffectTemplate = {
  id: string;
  title: string;
  category: string; // e.g., Transformation Templates, Festival Templates, etc.
  isNew?: boolean;
  durationSec: number;
  creditsCost: number;
  preview: string; // image path in public or remote url
  tags?: string[];
};

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "transformation", label: "Transformation Templates" },
  { id: "festival", label: "Festival Templates" },
  { id: "dynamic", label: "Dynamic Templates" },
  { id: "interactive", label: "Interactive Templates" },
  { id: "funny", label: "Funny Templates" },
  { id: "ecommerce", label: "Ecommerce" },
];

const TEMPLATES: EffectTemplate[] = [
  {
    id: "labubu-transform",
    title: "Labubu Transformation",
    category: "transformation",
    isNew: true,
    durationSec: 8,
    creditsCost: 60,
    preview: "/effects/labubu.jpg",
    tags: ["Character", "Mask"],
  },
  {
    id: "santa-claus",
    title: "Become Santa Claus",
    category: "festival",
    isNew: true,
    durationSec: 10,
    creditsCost: 80,
    preview: "/effects/santa.jpg",
    tags: ["Holiday", "Costume"],
  },
  {
    id: "labubu-blind-box",
    title: "Labubu Transformation (Blind Box Version)",
    category: "transformation",
    isNew: true,
    durationSec: 8,
    creditsCost: 70,
    preview: "/effects/labubu-blind.jpg",
    tags: ["Character", "Surprise"],
  },
  {
    id: "neon-motion",
    title: "Neon Motion Trails",
    category: "dynamic",
    durationSec: 6,
    creditsCost: 40,
    preview: "/effects/neon.jpg",
    tags: ["Glow", "Motion"],
  },
  {
    id: "comic-speech",
    title: "Comic Speech Bubbles",
    category: "interactive",
    durationSec: 5,
    creditsCost: 35,
    preview: "/effects/comic.jpg",
    tags: ["Talk", "Overlay"],
  },
  {
    id: "face-swap-funny",
    title: "Funny Face Swap",
    category: "funny",
    durationSec: 6,
    creditsCost: 30,
    preview: "/effects/faceswap.jpg",
    tags: ["Comedy"],
  },
  {
    id: "product-zoom",
    title: "Product Zoom Showcase",
    category: "ecommerce",
    durationSec: 12,
    creditsCost: 90,
    preview: "/effects/product.jpg",
    tags: ["Promo", "Detail"],
  },
  {
    id: "festival-fireworks",
    title: "Festival Fireworks Overlay",
    category: "festival",
    durationSec: 10,
    creditsCost: 50,
    preview: "/effects/fireworks.jpg",
    tags: ["Celebration"],
  },
];

export default function EffectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");

  const countsByCategory = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const c of CATEGORIES) acc[c.id] = 0;
    for (const t of TEMPLATES) {
      acc[t.category] = (acc[t.category] || 0) + 1;
      acc["all"] = (acc["all"] || 0) + 1;
    }
    return acc;
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TEMPLATES.filter((t) =>
      (activeCategory === "all" || t.category === activeCategory) &&
      (!q || t.title.toLowerCase().includes(q) || (t.tags || []).some((tag) => tag.toLowerCase().includes(q)))
    );
  }, [activeCategory, search]);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        {/* Header */}
        <section className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <Wand2 className="w-7 h-7 text-fuchsia-500" />
            <Badge variant="secondary">Video AI</Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-indigo-500 to-fuchsia-600 bg-clip-text text-transparent">
            Effect Templates
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your favorite effect template to create stunning video effects.
          </p>
        </section>

        {/* Search */}
        <div className="max-w-3xl mx-auto">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by name or category..."
            className="h-12 text-base"
          />
        </div>

        {/* Category chips */}
        <div className="flex flex-wrap items-center gap-3 justify-center">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  active ? "bg-linear-to-r from-indigo-500/20 to-fuchsia-500/20 border-indigo-500/30" : "bg-muted border-transparent hover:bg-muted/60"
                }`}
              >
                {c.label} ({countsByCategory[c.id] || 0})
              </button>
            );
          })}
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <Card key={t.id} className="group overflow-hidden">
              <div className="relative">
                <div className="aspect-video bg-muted/30">
                  {/* Image preview - falls back to colored gradient if file not present */}
                  <div className="absolute inset-0 bg-linear-to-br from-indigo-500/20 via-violet-500/20 to-fuchsia-500/20" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.preview}
                    alt={t.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-90"
                    onError={(e) => {
                      // show gradient when image missing
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                {t.isNew && (
                  <Badge className="absolute top-2 left-2 bg-indigo-600">NEW</Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline">{labelForCategory(t.category)}</Badge>
                  {t.tags?.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {t.durationSec}s</span>
                    <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> {t.creditsCost} credits</span>
                  </div>
                  <span className="flex items-center gap-1"><Flame className="w-4 h-4 text-amber-500" /> Popular</span>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button size="sm">Use Template</Button>
                  <Button size="sm" variant="outline">Preview</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function labelForCategory(id: string) {
  const item = CATEGORIES.find((c) => c.id === id);
  return item ? item.label : id;
}
