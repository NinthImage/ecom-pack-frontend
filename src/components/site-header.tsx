"use client";

import Link from "next/link";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuViewport } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs";
import AnimatedLogo from "@/components/animated-logo";

export function SiteHeader() {
  const { isSignedIn } = useAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <AnimatedLogo size={32} showText />
        <nav>
          <NavigationMenu>
            <NavigationMenuList className="hidden md:flex">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium">AI Video</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 w-[420px]">
                    <NavigationMenuLink asChild>
                      <Link href="/video/text-to-video" className={cn("block rounded-md p-3 hover:bg-accent")}> 
                        <div className="text-sm font-medium">Text to Video</div>
                        <p className="text-xs text-muted-foreground">Generate videos from text prompts</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/video/image-to-video" className={cn("block rounded-md p-3 hover:bg-accent")}> 
                        <div className="text-sm font-medium">Image to Video</div>
                        <p className="text-xs text-muted-foreground">Animate images with AI motion</p>
                      </Link>
                    </NavigationMenuLink>
                    <div className="rounded-md p-3 border text-muted-foreground text-xs">
                      Video to Video (coming soon)
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* AI Image dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium">AI Image</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 w-[420px]">
                    <NavigationMenuLink asChild>
                      <Link href="/image" className={cn("block rounded-md p-3 hover:bg-accent")}> 
                        <div className="text-sm font-medium">Text to Image</div>
                        <p className="text-xs text-muted-foreground">Generate images from text prompts</p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/effects" className={cn("block rounded-md p-3 hover:bg-accent")}> 
                        <div className="text-sm font-medium">AI Effects</div>
                        <p className="text-xs text-muted-foreground">Apply styles and effects to images</p>
                      </Link>
                    </NavigationMenuLink>
                    <div className="rounded-md p-3 border text-muted-foreground text-xs">
                      Image Editing (coming soon)
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Existing AI Effects link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/effects" className={cn("px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground")}>AI Effects</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Dashboard link - only visible when signed in */}
              {isSignedIn && (
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/dashboard" className={cn("px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground")}>Dashboard</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              )}
              {/* Tools dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium">Tools</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4 w-[520px]">
                    <NavigationMenuLink asChild>
                      <Link href="/tools/prompt-generator" className={cn("group flex items-start gap-3 rounded-md p-3 border hover:bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 transition-all")}> 
                        <div className="mt-0.5 h-6 w-6 rounded bg-linear-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium flex items-center gap-2">
                            Prompt Generator
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">New</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Craft better prompts</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/image/editor" className={cn("group flex items-start gap-3 rounded-md p-3 border hover:bg-gradient-to-r from-emerald-500/10 to-teal-500/10 transition-all")}> 
                        <div className="mt-0.5 h-6 w-6 rounded bg-linear-to-br from-emerald-500 to-teal-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">AI Photo Editor</div>
                          <p className="text-xs text-muted-foreground">Edit photos with AI</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/tools/watermark" className={cn("group flex items-start gap-3 rounded-md p-3 border hover:bg-gradient-to-r from-rose-500/10 to-pink-500/10 transition-all")}> 
                        <div className="mt-0.5 h-6 w-6 rounded bg-linear-to-br from-rose-500 to-pink-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">Video Watermark Remover</div>
                          <p className="text-xs text-muted-foreground">Remove watermarks</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/tools" className={cn("group flex items-start gap-3 rounded-md p-3 border hover:bg-gradient-to-r from-sky-500/10 to-cyan-500/10 transition-all")}> 
                        <div className="mt-0.5 h-6 w-6 rounded bg-linear-to-br from-sky-500 to-cyan-500" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">More AI Tools</div>
                          <p className="text-xs text-muted-foreground">Browse all tools</p>
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Existing Models link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/models" className={cn("px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground")}>Models</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Added Inspiration link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/inspiration" className={cn("px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground")}>Inspiration</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Added Pricing link */}
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/pricing" className={cn("px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground")}>Pricing</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              {/* Theme Toggle */}
              <NavigationMenuItem>
                <ThemeToggle />
              </NavigationMenuItem>
              {/* Auth buttons */}
              {isSignedIn ? (
                <NavigationMenuItem>
                  <UserButton afterSignOutUrl="/" />
                </NavigationMenuItem>
              ) : (
                <>
                  <NavigationMenuItem>
                    <SignInButton mode="modal">
                      <Button variant="outline" size="sm" className="ml-2">
                        Sign In
                      </Button>
                    </SignInButton>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <SignUpButton mode="modal">
                      <Button variant="default" size="sm" className="ml-2">
                        Sign Up
                      </Button>
                    </SignUpButton>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </nav>
        {/* Mobile menu (visible on small screens) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" aria-label="Open Menu">
                <Menu className="w-4 h-4 mr-2" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild><Link href="/video/text-to-video">Text to Video</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/video/image-to-video">Image to Video</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/image">Text to Image</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/effects">AI Effects</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/models">Models</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/tools">Tools</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/inspiration">Inspiration</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/pricing">Pricing</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
