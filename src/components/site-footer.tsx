"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Image as ImageIcon, 
  Wand2, 
  Star, 
  Users, 
  Twitter,
  Instagram,
  Youtube,
  Github,
  Mail,
  MapPin
} from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t">
      <div className="container mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500" />
              <span className="text-xl font-bold tracking-tight">ninthimage</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Transform your ideas into captivating videos with cutting-edge AI models. 
              Create professional-quality content from text prompts or animate your images with precision.
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                1M+ Creators
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                50+ AI Models
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <Youtube className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* AI Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">AI Tools</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/video/text-to-video" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Text to Video
                </Link>
              </li>
              <li>
                <Link href="/video/image-to-video" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Image to Video
                </Link>
              </li>
              <li>
                <Link href="/effects" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  AI Effects
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-muted-foreground hover:text-foreground transition-colors">
                  AI Models
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* AI Models */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Popular Models</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/models/veo-3" className="text-muted-foreground hover:text-foreground transition-colors">
                  Veo 3
                </Link>
              </li>
              <li>
                <Link href="/models/seedance" className="text-muted-foreground hover:text-foreground transition-colors">
                  Seedance 1.0
                </Link>
              </li>
              <li>
                <Link href="/models/wan-2-2" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wan 2.2-S2V
                </Link>
              </li>
              <li>
                <Link href="/models/hailuo" className="text-muted-foreground hover:text-foreground transition-colors">
                  Hailuo 02
                </Link>
              </li>
              <li>
                <Link href="/models/kling" className="text-muted-foreground hover:text-foreground transition-colors">
                  Kling 2.1
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8 mb-12">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Stay Updated</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get the latest updates on new AI models, features, and creative inspiration delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border bg-background"
              />
              <Button className="px-6 py-3">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
              <p>&copy; 2024 ninthimage. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="/cookies" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <Link href="mailto:hello@ninthimage.com" className="hover:text-foreground transition-colors">
                  hello@ninthimage.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}