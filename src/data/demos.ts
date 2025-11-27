import type { DemoItem } from "@/components/gallery";
import { models } from "./models";

export const demoItems: DemoItem[] = models.slice(0, 12).map((m, i) => ({
  id: `${m.id}-${i}`,
  type: m.category === "video" ? "video" : m.category === "image" ? "image" : "effect",
  title: m.name,
  model: m.version ? `${m.version}` : "",
  tag: m.tags?.[0],
}));