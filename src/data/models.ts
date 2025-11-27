export type Model = {
  id: string;
  name: string;
  category: "video" | "image" | "effects";
  version?: string;
  tags?: Array<"NEW" | "HOT" | "AUDIO" | "TRY">;
  features?: string[];
  credits?: number;
  description?: string;
};

export const models: Model[] = [
  { id: "wan-25", name: "Wan 2.5", category: "video", version: "2.5", tags: ["NEW"], features: ["High fidelity", "Longer sequences"], credits: 220, description: "High-fidelity video generation with extended length support" },
  { id: "veo-3", name: "Google Veo 3", category: "video", version: "3", features: ["Fast", "Quality"], credits: 150, description: "Google's cinematic-grade video generation model" },
  { id: "sora-2", name: "Sora2 AI", category: "video", version: "2", features: ["Cinematic"], credits: 130, description: "Advanced text-to-video with realistic visuals" },
  { id: "seedance-1p", name: "Seedance 1.0 Pro", category: "video", version: "1.0", features: ["Pro mode"], credits: 120, description: "Specialized in human motion and dance sequences" },
  { id: "kling-v2", name: "Kling AI v2", category: "video", version: "2", features: ["Action"], credits: 200, description: "Action-focused generation with sharp motion" },
  { id: "hailuo", name: "Hailuo AI", category: "video", features: ["Stylized"], credits: 90, description: "Stylized, creative motion and effects" },
  { id: "veo3-fast", name: "Veo3 Fast", category: "video", features: ["Fast"], credits: 80, description: "Fast variant for quick iterations" },
  { id: "seedream-4", name: "Seedream 4.0", category: "image", version: "4.0", tags: ["NEW"], features: ["Photorealistic"], credits: 20, description: "Photorealistic image generation" },
  { id: "nano-banana", name: "Nano Banana", category: "image", tags: ["HOT"], features: ["Creative"], credits: 15, description: "Creative image styles" },
  { id: "hunyuan-image", name: "Hunyuan Image", category: "image", features: ["Clean"], credits: 12, description: "Clean, consistent image outputs" },
  { id: "qwen", name: "Qwen", category: "image", features: ["Artistic"], credits: 10, description: "Artistic generation and composition" },
  { id: "flux-krea", name: "Flux Krea", category: "image", features: ["Krea style"], credits: 18, description: "Krea-style visuals" },
  { id: "gemini-2-5", name: "Gemini 2.5 Flash", category: "image", features: ["Fast"], credits: 16, description: "Fast image generation" },
  { id: "grand-blueprint", name: "Grand Blueprint", category: "effects", tags: ["TRY"], features: ["Blueprint style"], credits: 8, description: "Blueprint aesthetic effect" },
  { id: "ladudu-me", name: "Ladudu Me", category: "effects", features: ["Cartoonize"], credits: 10, description: "Cartoonize portraits" },
  { id: "french-kiss", name: "French Kiss", category: "effects", features: ["Warm tones"], credits: 9, description: "Warm tone image effect" },
  { id: "fairy-me", name: "Fairy Me", category: "effects", features: ["Fantasy"], credits: 11, description: "Fantasy-style effect" },
  { id: "christmas-hug", name: "Christmas Hug", category: "effects", features: ["Festive"], credits: 12, description: "Festive holiday effect" },
];