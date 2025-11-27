"use client";

import { useMemo, useState, use } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedGallery, type DemoItem } from "@/components/gallery";
import { models as modelsData, type Model } from "@/data/models";
import { ArrowRight, Play, Video, Image as ImageIcon, Wand2 } from "lucide-react";

function categoryLabel(category: Model["category"]) {
  if (category === "video") return "Video";
  if (category === "image") return "Image";
  return "Effects";
}

function targetRoute(category: Model["category"]) {
  if (category === "video") return "/video/text-to-video";
  if (category === "image") return "/image";
  return "/effects";
}

function badgeColor(tag?: "NEW" | "HOT" | "AUDIO" | "TRY") {
  switch (tag) {
    case "HOT":
      return "bg-red-500";
    case "NEW":
      return "bg-blue-500";
    case "TRY":
      return "bg-purple-500";
    default:
      return "bg-slate-500";
  }
}

export default function ModelDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const model: Model | undefined = modelsData.find((m) => m.id === id);

  // Fallback: if not found, show a generic detail page rather than 404
  const resolvedModel: Model = model ?? {
    id,
    name: id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    category: "video",
    description: "Model details not found in catalog. Showing a generic preview.",
    credits: 100,
    features: ["High Quality", "Fast Generation"],
    tags: ["TRY"],
  };

  const [search, setSearch] = useState("");

  const galleryItems: DemoItem[] = useMemo(() => {
    // Create 8 placeholder demo entries using the model metadata
    const base: DemoItem = {
      id: `${resolvedModel.id}-demo`,
      type: resolvedModel.category === "video" ? "video" : resolvedModel.category === "image" ? "image" : "effect",
      title: resolvedModel.name,
      model: resolvedModel.version ? `${resolvedModel.version}` : "",
      tag: resolvedModel.tags?.[0],
    };
    const items = Array.from({ length: 8 }).map((_, i) => ({
      ...base,
      id: `${base.id}-${i}`,
      title: `${resolvedModel.name} Demo #${i + 1}`,
    }));
    if (!search) return items;
    return items.filter((it) => it.title.toLowerCase().includes(search.toLowerCase()));
  }, [resolvedModel, search]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          {resolvedModel.category === "video" ? (
            <Video className="w-6 h-6 text-blue-500" />
          ) : resolvedModel.category === "image" ? (
            <ImageIcon className="w-6 h-6 text-green-500" />
          ) : (
            <Wand2 className="w-6 h-6 text-purple-500" />
          )}
          <h1 className="text-2xl md:text-3xl font-bold">{resolvedModel.name}</h1>
          <Badge className={`${badgeColor(resolvedModel.tags?.[0])} text-white`}>{resolvedModel.tags?.[0] ?? "MODEL"}</Badge>
        </div>
        <p className="text-muted-foreground">{resolvedModel.description}</p>
      </section>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Model info */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              {categoryLabel(resolvedModel.category)} Model
            </CardTitle>
            <CardDescription>
              Credits per use: <span className="font-semibold">{resolvedModel.credits ?? 0}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {resolvedModel.features && resolvedModel.features.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Key Features</div>
                <div className="flex flex-wrap gap-2">
                  {resolvedModel.features.map((f) => (
                    <Badge key={f} variant="outline" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Button asChild className="w-full">
              <a href={targetRoute(resolvedModel.category)}>
                Use this model <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Right: Demo gallery with search */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Demo Gallery</CardTitle>
              <div className="w-64">
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search demos..."
                />
              </div>
            </div>
            <CardDescription>Scroll to explore demo videos, previews, and examples.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[600px] overflow-y-auto pr-1">
              <AnimatedGallery items={galleryItems} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}