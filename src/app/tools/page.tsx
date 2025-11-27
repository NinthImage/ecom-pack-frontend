"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Video, Image, Wand2, FileText, Eraser } from "lucide-react";

export default function ToolsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const tools = [
    {
      title: "Prompt Generator",
      description: "Create powerful prompts for AI image and video generation",
      icon: <FileText className="h-6 w-6" />,
      href: "/tools/prompt-generator",
      color: "from-blue-500 to-indigo-600"
    },
    {
      title: "Watermark Remover",
      description: "Remove visible watermarks from videos and images",
      icon: <Eraser className="h-6 w-6" />,
      href: "/tools/watermark",
      color: "from-pink-500 to-rose-600"
    },
    {
      title: "Image to Video",
      description: "Transform static images into dynamic videos",
      icon: <Video className="h-6 w-6" />,
      href: "/video/image-to-video",
      color: "from-green-500 to-emerald-600"
    },
    {
      title: "Text to Video",
      description: "Generate videos from text descriptions",
      icon: <FileText className="h-6 w-6" />,
      href: "/video/text-to-video",
      color: "from-purple-500 to-violet-600"
    },
    {
      title: "Video Effects",
      description: "Add stunning effects to your videos",
      icon: <Wand2 className="h-6 w-6" />,
      href: "/video/effects",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Image Generator",
      description: "Create AI-powered images from text prompts",
      icon: <Image className="h-6 w-6" />,
      href: "/image",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
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
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI Tools
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Powerful AI tools to enhance your creative workflow
        </p>
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {tools.map((tool, index) => (
          <motion.div key={index} variants={item}>
            <Link href={tool.href} className="block h-full">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-md`}>
                    <div className="text-white">
                      {tool.icon}
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
                  <p className="text-muted-foreground mb-6 flex-grow">{tool.description}</p>
                  <Button className="w-full mt-auto">
                    Use Tool
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}