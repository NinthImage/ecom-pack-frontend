"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

type AnimatedLogoProps = {
  size?: number;
  showText?: boolean;
  className?: string;
};

export function AnimatedLogo({ size = 36, showText = true, className }: AnimatedLogoProps) {
  const dim = `${size}px`;
  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ""}`} aria-label="ninthimage home">
      <motion.div
        className="relative"
        style={{ width: dim, height: dim }}
        whileHover={{ rotateX: 5, rotateY: -5, scale: 1.06 }}
        transition={{ type: "spring", stiffness: 220, damping: 16 }}
      >
        {/* Reflective diamond frame */}
        <motion.svg className="absolute inset-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" animate={{ rotate: 0 }}>
          <defs>
            <linearGradient id="diamond-stroke" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#FF00CC" />
            </linearGradient>
            <radialGradient id="glass-fill" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0.08)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
            </radialGradient>
            <clipPath id="diamond-clip">
              <polygon points="50,5 95,50 50,95 5,50" />
            </clipPath>
          </defs>
          {/* Outer diamond stroke with neon glow */}
          <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="url(#diamond-stroke)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 5 L95 50 L50 95 L5 50 Z" stroke="url(#diamond-stroke)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 14px rgba(0,240,255,0.55)) drop-shadow(0 0 20px rgba(255,0,204,0.45))" }} />
          {/* Subtle glass fill */}
          <polygon points="50,5 95,50 50,95 5,50" fill="url(#glass-fill)" />
        </motion.svg>

        {/* Mosaic of images clipped to diamond */}
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#diamond-clip)">
            <motion.g animate={{ x: [0, 0.8, -0.8, 0], y: [0, -0.6, 0.6, 0], scale: [1, 1.02, 1], rotate: [0, 1.5, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
              <image href="/globe.svg" x="8" y="20" width="28" height="28" opacity="0.9" />
              <image href="/next.svg" x="34" y="12" width="26" height="26" opacity="0.85" />
              <image href="/vercel.svg" x="58" y="30" width="28" height="28" opacity="0.9" />
              <image href="/window.svg" x="24" y="52" width="26" height="26" opacity="0.9" />
              <image href="/file.svg" x="6" y="56" width="22" height="22" opacity="0.8" />
            </motion.g>
            {/* Second layer slight parallax */}
            <motion.g animate={{ x: [0, -0.6, 0.6, 0], y: [0, 0.8, -0.8, 0], scale: [1, 1.015, 1], rotate: [0, -1.2, 0] }} transition={{ repeat: Infinity, duration: 7.2, ease: "easeInOut" }}>
              <image href="/globe.svg" x="42" y="64" width="24" height="24" opacity="0.85" />
              <image href="/next.svg" x="72" y="16" width="22" height="22" opacity="0.8" />
            </motion.g>
          </g>
        </svg>

        {/* Moving shine across the diamond */}
        <motion.div
          className="absolute inset-0"
          style={{ WebkitMaskImage: "polygon(50% 5%, 95% 50%, 50% 95%, 5% 50%)" as any }}
          animate={{ x: ["-30%", "130%"] }}
          transition={{ repeat: Infinity, duration: 3.8, ease: "easeInOut" }}
        >
          <div
            className="absolute top-0 h-full w-[24%]"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0) 100%)",
              transform: "skewX(-18deg)",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,0.35))",
            }}
          />
        </motion.div>

        {/* Mini creatures assemble the mark, then fade */}
        {Array.from({ length: 14 }).map((_, i) => {
          const start = [
            { x: "6%", y: "20%" },
            { x: "12%", y: "8%" },
            { x: "22%", y: "12%" },
            { x: "10%", y: "42%" },
            { x: "18%", y: "66%" },
            { x: "8%", y: "78%" },
            { x: "30%", y: "86%" },
            { x: "44%", y: "90%" },
            { x: "72%", y: "82%" },
            { x: "86%", y: "64%" },
            { x: "92%", y: "40%" },
            { x: "84%", y: "18%" },
            { x: "64%", y: "10%" },
            { x: "42%", y: "6%" },
          ][i];
          const target = [
            { x: "28%", y: "28%" },
            { x: "30%", y: "22%" },
            { x: "32%", y: "36%" },
            { x: "40%", y: "46%" },
            { x: "46%", y: "36%" },
            { x: "52%", y: "26%" },
            { x: "58%", y: "36%" },
            { x: "64%", y: "46%" },
            { x: "62%", y: "56%" },
            { x: "54%", y: "62%" },
            { x: "46%", y: "56%" },
            { x: "38%", y: "50%" },
            { x: "34%", y: "60%" },
            { x: "28%", y: "54%" },
          ][i];
          const sizePx = 3.5 + ((i % 5) * 0.6);
          const delay = 0.2 + i * 0.08;
          return (
            <motion.div
              key={`creature-${i}`}
              className="absolute rounded-full"
              style={{
                width: sizePx,
                height: sizePx,
                left: start.x,
                top: start.y,
                background: i % 2 === 0 ? "linear-gradient(135deg, #00F0FF, #A78BFA)" : "linear-gradient(135deg, #FF00CC, #6366F1)",
                boxShadow: i % 2 === 0 ? "0 0 8px rgba(0,240,255,0.6)" : "0 0 8px rgba(255,0,204,0.6)",
              }}
              initial={{ opacity: 0.0, scale: 0.8 }}
              animate={{
                opacity: [0.0, 1, 1, 0],
                scale: [0.8, 1, 1.1, 0.2],
                left: [start.x, target.x],
                top: [start.y, target.y],
              }}
              transition={{
                delay,
                times: [0, 0.2, 0.7, 1],
                duration: 3.6,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Edge spark particles */}
        <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 22, ease: "linear" }}>
          <div className="absolute left-1/2 -translate-x-1/2 top-[3%] h-[6px] w-[6px] rounded-full" style={{ background: "linear-gradient(135deg, #00F0FF, #A78BFA)", boxShadow: "0 0 10px rgba(0,240,255,0.7)" }} />
          <div className="absolute left-[7%] top-1/2 -translate-y-1/2 h-[5px] w-[5px] rounded-full" style={{ background: "linear-gradient(135deg, #FF00CC, #6366F1)", boxShadow: "0 0 10px rgba(255,0,204,0.7)" }} />
        </motion.div>
        <motion.div
          className="absolute inset-[12%] rounded-[12%]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(45deg, rgba(0,240,255,0.08) 0px, rgba(0,240,255,0.08) 1px, transparent 1px, transparent 4px),
              repeating-linear-gradient(-45deg, rgba(255,0,204,0.06) 0px, rgba(255,0,204,0.06) 1px, transparent 1px, transparent 4px)
            `,
            mixBlendMode: "screen",
            boxShadow: "0 0 22px rgba(0,240,255,0.28)",
          }}
          animate={{ backgroundPositionY: [0, 10, 0], backgroundPositionX: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        />

        {/* Orbiting data nodes */}
        <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 11, ease: "linear" }}>
          <div className="absolute left-1/2 -translate-x-1/2 top-[3%] h-[6px] w-[6px] rounded-full" style={{ background: "linear-gradient(135deg, #00F0FF, #A78BFA)", boxShadow: "0 0 10px rgba(0,240,255,0.7)" }} />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 16, ease: "linear" }}>
          <div className="absolute left-[9%] top-1/2 -translate-y-1/2 h-[5px] w-[5px] rounded-full" style={{ background: "linear-gradient(135deg, #FF00CC, #6366F1)", boxShadow: "0 0 10px rgba(255,0,204,0.7)" }} />
        </motion.div>
        <motion.div className="absolute inset-0" style={{ transformOrigin: "50% 50%" }} animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }}>
          <div className="absolute right-[10%] top-[24%] h-[4px] w-[4px] rounded-full" style={{ background: "linear-gradient(135deg, #7C3AED, #00F0FF)", boxShadow: "0 0 7px rgba(124,58,237,0.6)" }} />
        </motion.div>

        {/* Animated NI glyph with marching stroke */}
        <svg className="absolute inset-[20%]" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ni-stroke-2" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#FF00CC" />
            </linearGradient>
          </defs>
          <motion.g animate={{ x: [0, -0.4, 0.8, 0, -0.2, 0], opacity: [1, 0.98, 1, 0.97, 1, 1] }} transition={{ repeat: Infinity, duration: 3.6, ease: "easeInOut" }}>
            <motion.path
              d="M8 50 L8 10 L45 50 L45 10"
              stroke="url(#ni-stroke-2)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 10px rgba(0,240,255,0.55)) drop-shadow(0 0 12px rgba(255,0,204,0.45))" }}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.g>
          <motion.path
            d="M52 10 L52 50"
            stroke="url(#ni-stroke-2)"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ strokeDasharray: 16, strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: [0, 16] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
          />
        </svg>
      </motion.div>

      {showText && (
        <motion.span
          className="text-sm font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500"
          initial={{ opacity: 0, letterSpacing: "0.02em" }}
          animate={{ opacity: 1, backgroundPositionX: ["0%", "100%", "0%"], scale: [1, 1.04, 1], letterSpacing: ["0.02em", "0.04em", "0.02em"] }}
          transition={{ delay: 2.6, repeat: Infinity, duration: 8, ease: "linear" }}
          style={{ backgroundSize: "200% 200%", textShadow: "0 0 12px rgba(0,240,255,0.45), 0 0 18px rgba(255,0,204,0.35)" }}
        >
          ninthimage
        </motion.span>
      )}
    </Link>
  );
}

export default AnimatedLogo;
