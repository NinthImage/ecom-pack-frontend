"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { VideoSidebar } from "@/components/video-sidebar";

export default function VideoToVideoPage() {
  const [isGenerating] = useState(false);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        {/* Header removed per request */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Placeholder Input */}
          <Card>
            <CardHeader>
              <CardTitle>Upload and Transform</CardTitle>
              <CardDescription>Upload your video and apply transformations (soon)</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Start Transforming (soon)</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Placeholder Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your transformed video will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                Coming soon
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}