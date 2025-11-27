"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface CreditDisplayProps {
  totalCredits: number;
  usedCredits: number;
}

export function CreditDisplay({
  totalCredits = 1000,
  usedCredits = 350,
}: CreditDisplayProps) {
  const remainingCredits = totalCredits - usedCredits;
  const percentageUsed = (usedCredits / totalCredits) * 100;
  
  // For animated counter
  const [count, setCount] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  
  useEffect(() => {
    // Animate progress bar on load
    const timer = setTimeout(() => {
      setProgressValue(percentageUsed);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentageUsed]);
  
  useEffect(() => {
    const animateCount = () => {
      const duration = 1000; // ms
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(progress * remainingCredits);
        
        setCount(currentCount);
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
    };
    
    animateCount();
  }, [remainingCredits]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-5 bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Available Credits</h3>
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20,
            delay: 0.3
          }}
          className="text-sm font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300"
        >
          <span className="font-bold">{count}</span> credits remaining
        </motion.div>
      </div>

      <div className="relative pt-1">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-full h-3 bg-gray-200 dark:bg-gray-700"
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressValue}%` }}
            transition={{ 
              duration: 1,
              ease: "easeOut",
              delay: 0.2
            }}
            className="h-full rounded-full bg-linear-to-r from-blue-500 to-indigo-600"
          />
        </motion.div>
        
        {/* Animated marker for current position */}
        <motion.div 
          initial={{ left: 0, opacity: 0 }}
          animate={{ 
            left: `${progressValue}%`, 
            opacity: 1 
          }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.2
          }}
          className="absolute top-0 h-3 flex items-center justify-center"
          style={{ transform: "translateX(-50%)" }}
        >
          <div className="w-3 h-3 bg-white dark:bg-blue-300 rounded-full border-2 border-blue-600 dark:border-blue-400 shadow-md" />
        </motion.div>
      </div>

      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
        <span>{usedCredits} used</span>
        <span>{totalCredits} total</span>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 h-11" asChild>
          <Link href="/pricing">
            <Sparkles className="h-4 w-4 mr-2" />
            Buy More Credits
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
}