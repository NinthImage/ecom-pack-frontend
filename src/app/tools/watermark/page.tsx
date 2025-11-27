"use client";

import { VideoSidebar } from "@/components/video-sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Eraser, CheckCircle, Image, Video } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function WatermarkRemoverPage() {
  const [fileName, setFileName] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [fileType, setFileType] = useState<"video" | "image">("video");

  const fakeProcess = async () => {
    setStatus("Processing watermark removal...");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("Done. Preview on the right.");
  };

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-12 w-12 rounded-full bg-linear-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-md">
              <Eraser className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            Watermark Remover
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Remove visible watermarks from videos and images
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setFileType("video")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-l-md ${
                  fileType === "video"
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Video className="h-4 w-4" />
                Video
              </button>
              <button
                onClick={() => setFileType("image")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-r-md ${
                  fileType === "image"
                    ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                }`}
              >
                <Image className="h-4 w-4" />
                Image
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="shadow-md border-t-4 border-t-pink-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>Upload {fileType === "video" ? "Video" : "Image"}</span>
                  <div className="h-5 w-5 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                    <Upload className="h-3 w-3 text-white" />
                  </div>
                </CardTitle>
                <CardDescription>
                  {fileType === "video" 
                    ? "Supported: mp4, mov, webm" 
                    : "Supported: jpg, png, webp"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your {fileType} here, or click to browse
                  </p>
                  <input
                    type="file"
                    accept={fileType === "video" ? "video/*" : "image/*"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFileName(file.name);
                    }}
                    className="w-full opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="pointer-events-none"
                  >
                    Select {fileType}
                  </Button>
                </div>
                <Button 
                  onClick={fakeProcess} 
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  Remove Watermark
                </Button>
                {status && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {status.includes("Done") ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : null}
                    <p>{status}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-md border-t-4 border-t-rose-500">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Result preview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="min-h-[240px] rounded-md border bg-muted/30 p-4 flex items-center justify-center">
                  {fileName ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                      <p className="text-sm font-medium">Processed: {fileName}</p>
                      <p className="text-xs text-muted-foreground mt-1">Watermark successfully removed</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Upload a {fileType} to preview</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}