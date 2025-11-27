"use client";

import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";

export default function EffectsPage() {
  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
-        <section className="text-center space-y-4">
-          <div className="flex items-center justify-center gap-2 mb-4">
-            <Wand2 className="w-8 h-8 text-indigo-500" />
-          </div>
-          <h1 className="text-4xl md:text-5xl font-bold">Effects</h1>
-          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
-            Apply AI-powered effects and stylization to videos. This section is a stub to mirror ArtAny’s left navigation.
-          </p>
-          <div className="flex items-center justify-center gap-2">
-            <Badge variant="secondary">Preview</Badge>
-            <Badge variant="outline">More soon</Badge>
-          </div>
-        </section>
+        {/* Header removed per request */}

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload</CardTitle>
              <CardDescription>Select a video to apply effects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                Upload UI coming soon
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Result preview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                Effects preview coming soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}