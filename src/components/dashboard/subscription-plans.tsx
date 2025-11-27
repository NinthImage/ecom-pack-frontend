"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { motion } from "framer-motion";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "month",
    credits: 50,
    features: ["5 images per day", "Basic editing tools", "Standard quality"],
    current: false
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "month",
    credits: 500,
    features: ["50 images per day", "Advanced editing tools", "HD quality", "Priority support"],
    current: true
  },
  {
    id: "premium",
    name: "Premium",
    price: "$49",
    period: "month",
    credits: 2000,
    features: ["Unlimited images", "All editing tools", "4K quality", "24/7 support", "API access"],
    current: false
  }
];

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

const listItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 }
};

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<string>(
    plans.find(plan => plan.current)?.id || "free"
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Subscription Plans</h3>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm font-medium px-3 py-1 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/50"
        >
          Current: Pro Plan
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch max-w-3xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            variants={item}
            whileHover={{ 
              y: -5, 
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" 
            }}
            className={`relative rounded-xl overflow-hidden border h-full flex flex-col ${
              plan.current
                ? "border-blue-200 dark:border-blue-800 bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
            } p-4 shadow-sm transition-all duration-200`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            {plan.current && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg"
              >
                CURRENT
              </motion.div>
            )}
            
            <div className="space-y-3 flex flex-col h-full">
              <h3 className="text-lg font-bold">{plan.name}</h3>
              
              <div>
                <span className="text-2xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-gray-500 dark:text-gray-400 ml-1 text-sm">
                    /{plan.period}
                  </span>
                )}
              </div>
              
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {plan.credits} credits
              </div>
              
              <motion.ul 
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-1 mt-2 text-xs"
              >
                {plan.features.map((feature, index) => (
                  <motion.li 
                    key={index}
                    variants={listItem}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="flex items-center"
                  >
                    <Check className="h-3 w-3 text-green-500 mr-1 shrink-0" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </motion.ul>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={selectedPlan === plans.find(plan => plan.current)?.id && plan.current}
                className={`mt-auto w-full ${!plan.current ? "bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"} py-1.5 px-3 rounded-lg font-medium transition-all duration-200 text-sm`}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}