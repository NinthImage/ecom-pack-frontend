import { VideoSidebar } from "@/components/video-sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function VideoPage() {
  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <VideoSidebar />
      <div className="space-y-8">
        <h1 className="text-2xl font-bold">AI Video</h1>
        <p className="text-muted-foreground">
          Use Text to Video, Image to Video, and Video to Video with models like Wan 2.5, Veo 3, Sora2, Seedance, Kling, and more.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/video/text-to-video">Start Text to Video</Link>
          </Button>
          <Button asChild>
            <Link href="/video/image-to-video">Image to Video</Link>
          </Button>
          <Button variant="secondary" disabled>
            Video to Video (coming soon)
          </Button>
        </div>
      </div>
    </div>
  );
}