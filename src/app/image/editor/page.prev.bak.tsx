"use client";

import { useState } from "react";
import { VideoSidebar } from "@/components/video-sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pencil, Image as ImageIcon } from "lucide-react";

export default function ImageEditorPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>("");

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
-        {/* Header */}
-        <section className="text-center space-y-4">
-          <div className="flex items-center justify-center gap-2 mb-2">
-            <Pencil className="w-8 h-8 text-indigo-500" />
-            <ImageIcon className="w-8 h-8 text-pink-500" />
-          </div>
-          <h1 className="text-4xl md:text-5xl font-bold">AI Image Editor</h1>
-          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
-            Upload an image and apply AI-powered edits like upscale, enhance, and style changes.
-          </p>
-          <div className="flex items-center justify-center gap-2">
-            <Badge variant="secondary">Preview</Badge>
-            <Badge variant="outline">Coming Soon</Badge>
-          </div>
-        </section>
+        {/* Header removed per request */}

        {/* Editor */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Upload</CardTitle>
              <CardDescription>Select an image to edit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {uploadedImage ? (
                  <div className="space-y-3">
                    <img src={uploadedImage} alt="Uploaded" className="mx-auto rounded-md max-h-64 object-contain" />
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => setUploadedImage("")}>Remove</Button>
                      <Button disabled>Change</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload UI coming soon</p>
                    <Button disabled>Upload Image</Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button disabled>Upscale 4x</Button>
                <Button disabled>Enhance</Button>
                <Button disabled>Colorize</Button>
                <Button disabled>Style Transfer</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Your edited image will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground">
                {isProcessing ? (
                  <div className="text-center space-y-2">
                    <div className="animate-pulse">Processing...</div>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="w-12 h-12 mx-auto" />
                    <p className="text-sm">Upload an image to begin</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}