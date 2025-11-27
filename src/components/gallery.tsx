"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type DemoItem = {
  id: string;
  type: "image" | "video" | "effect";
  title: string;
  model: string;
  tag?: "NEW" | "HOT" | "AUDIO" | "TRY";
};

const colors = [
  "from-indigo-500 via-sky-500 to-cyan-400",
  "from-fuchsia-500 via-purple-500 to-indigo-500",
  "from-rose-500 via-pink-500 to-orange-400",
  "from-emerald-500 via-teal-500 to-cyan-500",
];

export function AnimatedGallery({ items }: { items: DemoItem[] }) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className={`aspect-video w-full bg-gradient-to-br ${colors[idx % colors.length]}`}></div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="text-sm font-medium">
                    {item.title}
                    <span className="ml-2 text-xs text-muted-foreground">{item.model}</span>
                  </div>
                  {item.tag && (
                    <Badge variant={item.tag === "HOT" ? "destructive" : "default"}>{item.tag}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}