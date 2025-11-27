"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Film,
  Video,
  Wand2,
  Sparkles,
  Image as ImageIcon,
  Pencil,
  User,
  FileText,
  Folder,
  Crown,
} from "lucide-react";

function NavItem({ href, icon: Icon, label, disabled = false }: { href: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; disabled?: boolean }) {
  const pathname = usePathname();
  const active = pathname === href;
  const className = `relative flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-all ${
    active ? "bg-linear-to-r from-indigo-500/20 to-fuchsia-500/20 text-foreground border-l-2 border-indigo-500" : "text-muted-foreground hover:bg-linear-to-r hover:from-indigo-500/15 hover:to-fuchsia-500/15 hover:text-foreground"
  } ${disabled ? "opacity-60 pointer-events-none" : ""}`;
  return (
    <Link href={href} className={className} aria-disabled={disabled}>
      {active && <span className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-indigo-500" />}
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  );
}

export function VideoSidebar() {
  return (
    <aside className="hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="w-[240px] rounded-lg border bg-card p-3">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground">Video AI</h4>
          <NavItem href="/video/image-to-video" icon={Film} label="Image to Video" />
          <NavItem href="/video/text-to-video" icon={Video} label="Text to Video" />
          <NavItem href="/video/video-editor" icon={Video} label="AI Video Editor" />
          <NavItem href="/video/effects" icon={Sparkles} label="Effects" />
          <NavItem href="/video/video-to-video" icon={Wand2} label="Video to Video" />
        </div>
        <div className="my-3 border-t" />
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground">Image AI</h4>
          <NavItem href="/image" icon={ImageIcon} label="AI Image Generator" />
          <NavItem href="/image/editor" icon={Pencil} label="AI Image Editor" />
        </div>
        <div className="my-3 border-t" />
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground">AI Tools</h4>
          <NavItem href="/tools/avatar" icon={User} label="AI Avatar" />
          <NavItem href="/tools/prompt-generator" icon={FileText} label="Prompt Generator" />
        </div>
        <div className="my-3 border-t" />
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground">My</h4>
          <NavItem href="/creations" icon={Folder} label="My Creations" />
        </div>
        <div className="my-3 border-t" />
        <div className="space-y-2">
          <Button asChild className="w-full">
            <Link href="/pricing">
              <Crown className="w-4 h-4 mr-2" /> Upgrade to Pro
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}
