"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { CreditDisplay } from "@/components/dashboard/credit-display";
import { SubscriptionPlans } from "@/components/dashboard/subscription-plans";
import { ToolUsageList } from "@/components/dashboard/tool-usage-list";
import { motion } from "framer-motion";
import { Sparkles, BarChart3, CreditCard } from "lucide-react";

export default function DashboardPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  
  if (isLoaded && !isSignedIn) {
    redirect("/sign-in");
  }

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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
      >
        Dashboard
      </motion.h1>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div 
          variants={item}
          className="col-span-2"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center mb-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
                className="h-12 w-12 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-4 shadow-lg"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold">Welcome, {user?.firstName || "User"}!</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6 ml-16">
              Manage your subscription, credits, and view your tool usage statistics.
            </p>
            
            <CreditDisplay totalCredits={500} usedCredits={175} />
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={item}
          className="col-span-1"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center mb-4">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.3 }}
                className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-md"
              >
                <CreditCard className="h-5 w-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold">Account Summary</h2>
            </div>
            <div className="space-y-4 mt-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <span className="text-gray-600 dark:text-gray-300">Email</span>
                <span className="font-medium">{user?.emailAddresses?.[0]?.emailAddress || "Not available"}</span>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <span className="text-gray-600 dark:text-gray-300">Member Since</span>
                <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"}</span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <motion.div 
          variants={item}
          className="lg:col-span-2"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            <div className="flex items-center mb-6">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.4 }}
                className="h-10 w-10 rounded-full bg-linear-to-br from-blue-500 to-green-500 flex items-center justify-center mr-3 shadow-md"
              >
                <BarChart3 className="h-5 w-5 text-white" />
              </motion.div>
              <h2 className="text-xl font-semibold">Tool Usage</h2>
            </div>
            <ToolUsageList />
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={item}
          className="lg:col-span-1"
        >
          <motion.div 
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-linear-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
          >
            <SubscriptionPlans />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}