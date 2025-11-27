"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Wand2, Download, Loader2, Image, Sparkles, Palette, Camera } from "lucide-react";
import { API_BASE } from "@/lib/config";

const effectCategories = [
  {
    id: "style-transfer",
    name: "Style Transfer",
    icon: Palette,
    effects: [
      { id: "oil-painting", name: "Oil Painting", credits: 20, description: "Transform photos into oil painting masterpieces" },
      { id: "watercolor", name: "Watercolor", credits: 25, description: "Create beautiful watercolor artwork from images" },
      { id: "anime-style", name: "Anime Style", credits: 30, description: "Convert photos to anime/manga style" },
      { id: "sketch", name: "Pencil Sketch", credits: 15, description: "Turn images into detailed pencil sketches" },
    ]
  },
  {
    id: "enhancement",
    name: "Enhancement",
    icon: Sparkles,
    effects: [
      { id: "upscale-4x", name: "4x Upscale", credits: 40, description: "Increase image resolution by 4x with AI" },
      { id: "colorize", name: "Colorize", credits: 35, description: "Add realistic colors to black & white photos" },
      { id: "denoise", name: "Denoise", credits: 20, description: "Remove noise and grain from images" },
      { id: "sharpen", name: "AI Sharpen", credits: 25, description: "Enhance image sharpness and clarity" },
    ]
  },
  {
    id: "artistic",
    name: "Artistic",
    icon: Camera,
    effects: [
      { id: "pop-art", name: "Pop Art", credits: 30, description: "Create vibrant pop art style images" },
      { id: "cyberpunk", name: "Cyberpunk", credits: 35, description: "Apply futuristic cyberpunk aesthetics" },
      { id: "vintage", name: "Vintage Film", credits: 25, description: "Add nostalgic vintage film effects" },
      { id: "neon-glow", name: "Neon Glow", credits: 30, description: "Add vibrant neon lighting effects" },
    ]
  }
];

export default function EffectsPage() {
  const [selectedCategory, setSelectedCategory] = useState("style-transfer");
  const [selectedEffect, setSelectedEffect] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [intensity, setIntensity] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  const currentCategory = effectCategories.find(cat => cat.id === selectedCategory);
  const selectedEffectData = currentCategory?.effects.find(effect => effect.id === selectedEffect);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyEffect = async () => {
    if (!selectedEffect || !uploadedImage) {
      setError("Please select an effect and upload an image");
      return;
    }

    setIsProcessing(true);
    setError("");
    setResult("");

    try {
      const formData = new FormData();
      formData.append("image", uploadedImage);
      formData.append("effect_id", selectedEffect);
      formData.append("intensity", intensity.toString());

      const response = await fetch(`${API_BASE}/api/pipeline/apply-effect`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data.message || "Effect applied successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while applying effect");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setSelectedEffect("");
    setUploadedImage(null);
    setImagePreview("");
    setIntensity(50);
    setResult("");
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Wand2 className="w-8 h-8 text-purple-500" />
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold">AI Effects</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your images with powerful AI effects. Apply artistic styles, enhance quality, and create stunning visual transformations.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Control Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5" />
              Apply Effects
            </CardTitle>
            <CardDescription>
              Upload an image and select an effect to transform it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Effect Category</label>
              <div className="grid grid-cols-3 gap-2">
                {effectCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedEffect("");
                      }}
                      className="flex flex-col gap-1 h-auto py-3"
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Effect Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose Effect</label>
              <Select value={selectedEffect} onValueChange={setSelectedEffect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an effect" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategory?.effects.map((effect) => (
                    <SelectItem key={effect.id} value={effect.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{effect.name}</span>
                        <Badge variant="secondary" className="ml-2">
                          {effect.credits} credits
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedEffectData && (
                <p className="text-sm text-muted-foreground">
                  {selectedEffectData.description}
                </p>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Image</label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded preview" 
                      className="max-w-full max-h-40 mx-auto rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Click to upload an image</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      Choose File
                    </Button>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Intensity Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Effect Intensity</label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Subtle</span>
                  <span>{intensity}%</span>
                  <span>Strong</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={handleApplyEffect} 
                disabled={isProcessing || !selectedEffect || !uploadedImage}
                className="flex-1"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Apply Effect
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            
            {result && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800">{result}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Result Preview
            </CardTitle>
            <CardDescription>
              Your transformed image will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-muted/30 rounded-lg flex items-center justify-center">
              {isProcessing ? (
                <div className="text-center space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                  <div>
                    <p className="font-medium">Applying effect...</p>
                    <p className="text-sm text-muted-foreground">This may take a moment</p>
                  </div>
                </div>
              ) : result ? (
                <div className="text-center space-y-4">
                  <Sparkles className="w-12 h-12 mx-auto text-green-500" />
                  <div>
                    <p className="font-medium">Effect Applied!</p>
                    <p className="text-sm text-muted-foreground">Ready for download</p>
                  </div>
                  <Button>
                    <Download className="w-4 h-4 mr-2" />
                    Download Result
                  </Button>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Image className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Upload an image and apply an effect to see the result
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Effect Gallery */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Available Effects</h2>
        <div className="space-y-8">
          {effectCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {category.name}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.effects.map((effect) => (
                    <Card 
                      key={effect.id} 
                      className={`cursor-pointer transition-all ${
                        selectedEffect === effect.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedEffect(effect.id);
                      }}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{effect.name}</CardTitle>
                          <Badge variant="secondary">{effect.credits}</Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {effect.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tips */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Tips for Best Results</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>• Use high-resolution images for better effect quality</li>
            <li>• Start with lower intensity and increase gradually</li>
            <li>• Portrait photos work best for style transfer effects</li>
            <li>• Enhancement effects are ideal for old or low-quality images</li>
            <li>• Processing time varies from 10 seconds to 2 minutes depending on effect complexity</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}