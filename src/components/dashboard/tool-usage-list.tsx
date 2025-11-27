"use client";

import { BarChart, Calendar, Image, Video } from "lucide-react";
import { motion } from "framer-motion";

// Mock data for tool usage
const toolUsage = [
  {
    id: "text-to-image",
    name: "Text to Image",
    icon: Image,
    usageCount: 45,
    creditsUsed: 90,
    lastUsed: "2023-11-15T14:30:00Z"
  },
  {
    id: "text-to-video",
    name: "Text to Video",
    icon: Video,
    usageCount: 12,
    creditsUsed: 120,
    lastUsed: "2023-11-14T09:15:00Z"
  },
  {
    id: "image-to-video",
    name: "Image to Video",
    icon: Video,
    usageCount: 8,
    creditsUsed: 80,
    lastUsed: "2023-11-13T16:45:00Z"
  },
  {
    id: "ai-effects",
    name: "AI Effects",
    icon: BarChart,
    usageCount: 23,
    creditsUsed: 46,
    lastUsed: "2023-11-15T11:20:00Z"
  }
];

export function ToolUsageList() {
  // Format date to a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Tool</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Usage Count</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Credits Used</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last Used</th>
            </tr>
          </thead>
          <tbody>
            {toolUsage.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.tr 
                  key={tool.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  whileHover={{ 
                    backgroundColor: "rgba(59, 130, 246, 0.05)",
                    transition: { duration: 0.1 }
                  }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="h-9 w-9 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mr-3 shadow-sm"
                      >
                        <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <span className="font-medium">{tool.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">{tool.usageCount}</td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600 dark:text-blue-400">{tool.creditsUsed}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="text-sm">{formatDate(tool.lastUsed)}</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-end pt-4">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center"
        >
          View Full History
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}