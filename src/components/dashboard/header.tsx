"use client";

import { motion } from "framer-motion";

/**
 * Top header bar — centered SpaceHack branding, clean layout.
 */
export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative z-50 flex items-center justify-between px-5 sm:px-8 py-3.5 border-b border-white/[0.06] bg-[#030306]/80 backdrop-blur-xl"
    >
      {/* Left: Net-Zero label */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 shadow-sm shadow-emerald-400/30" />
          <div className="w-2 h-2 rounded-sm bg-cyan-400/60" />
        </div>
        <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.15em] text-white/50">
          Net-Zero Supply Chain
        </span>
      </div>

      {/* Center: SpaceHack — prominent and centered */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3">
        <div className="h-4 w-px bg-white/15" />
        <span className="text-sm sm:text-lg font-bold uppercase tracking-[0.2em] text-white/50">
          SpaceHack 2026
        </span>
        <div className="h-4 w-px bg-white/15" />
      </div>

      {/* Right: Live indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-red-500/10 border border-red-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <span className="text-xs font-mono font-bold text-red-400 tracking-wider">
            LIVE
          </span>
        </div>
      </div>
    </motion.header>
  );
}
