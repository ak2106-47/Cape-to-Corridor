"use client";

import { motion } from "framer-motion";

/**
 * Technical stat card — bigger values, clearer labels, instantly scannable.
 */

interface StatCardProps {
  label: string;
  value: string;
  code: string;
  variant?: "danger" | "success";
  delay?: number;
}

export function StatCard({
  label,
  value,
  code,
  variant = "danger",
  delay = 0,
}: StatCardProps) {
  const accentColor = variant === "danger" ? "bg-red-500" : "bg-emerald-500";
  const valueColor = variant === "danger" ? "text-red-300" : "text-emerald-300";
  const codeColor = variant === "danger" ? "text-red-500/40" : "text-emerald-500/40";
  const borderColor = variant === "danger" ? "border-red-500/15" : "border-emerald-500/15";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`relative overflow-hidden border bg-white/[0.02] ${borderColor}`}
      style={{ borderRadius: "3px" }}
    >
      {/* Top accent bar */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentColor} opacity-60`} />

      {/* Content */}
      <div className="px-3.5 py-3 flex flex-col gap-1">
        {/* Header row: label + code */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-mono uppercase tracking-wider text-white/45 truncate">
            {label}
          </span>
          <span className={`text-[9px] font-mono font-bold tracking-widest ${codeColor}`}>
            {code}
          </span>
        </div>

        {/* Value — big and bold */}
        <span className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${valueColor}`}>
          {value}
        </span>
      </div>

      {/* Corner bracket */}
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10" aria-hidden />
    </motion.div>
  );
}
