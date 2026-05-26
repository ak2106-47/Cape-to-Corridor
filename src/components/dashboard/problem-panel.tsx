"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticker } from "./ticker";
import { StatCard } from "./stat-card";
import { PanelMapWrapper } from "./panel-map-wrapper";
import {
  HISTORICAL_CRISES,
  CUMULATIVE_HISTORICAL_CO2_TONNES,
  type HistoricalCrisis,
} from "@/lib/constants";
import { formatCompact } from "@/lib/utils";

/**
 * Left panel — historical chokepoint disruptions.
 * Bigger text, simpler language, instantly scannable by judges.
 */
export function ProblemPanel() {
  const [selectedIndex, setSelectedIndex] = useState(3);

  const activeCrisis: HistoricalCrisis = HISTORICAL_CRISES[selectedIndex];

  return (
    <div className="relative flex flex-col items-center h-full px-5 sm:px-8 py-6 sm:py-8 overflow-hidden tech-grid-bg scanline-overlay">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-red-950/50 via-[#0a0406] to-[#030306] pointer-events-none"
        aria-hidden
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 w-full max-w-xl">
        {/* Section header — BIG and clear */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center justify-center gap-3 self-center"
        >
          <div className="w-1.5 h-7 bg-red-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-red-400 uppercase tracking-wide">
            The Problem
          </h2>
        </motion.div>

        {/* Description — simple, direct */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-white/55 text-sm sm:text-base leading-relaxed"
        >
          Ships are{" "}
          <span className="text-red-300 font-semibold">forced to reroute around Africa</span>{" "}
          every time a maritime chokepoint is disrupted, wasting massive amounts of fuel and CO₂.
        </motion.p>

        {/* Historical crisis selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
              Select a Crisis
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {HISTORICAL_CRISES.map((crisis, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={crisis.code}
                  onClick={() => setSelectedIndex(index)}
                  className={`
                    relative px-2 py-2.5 text-center transition-all duration-200
                    font-mono text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    border rounded-sm
                    ${
                      isActive
                        ? "bg-red-500/15 border-red-500/40 text-red-300 shadow-sm shadow-red-500/10"
                        : "bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/15"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-red-500 rounded-t-sm" />
                  )}
                  {crisis.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CO₂ damage ticker */}
        <div className="w-full py-4 border-y border-red-500/10">
          <Ticker
            key={activeCrisis.code}
            label={`CO₂ Wasted — ${activeCrisis.year}`}
            unit="tonnes of CO₂"
            targetValue={activeCrisis.extraCO2Tonnes}
            isRealtime={activeCrisis.isOngoing}
            animationDuration={6000}
            numberClassName="text-red-400"
            labelClassName="text-red-400/80"
          />
        </div>

        {/* Cape route map */}
        <PanelMapWrapper variant="cape" delay={0.5} />

        {/* Contextual stat grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCrisis.code}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 gap-2 w-full"
          >
            <StatCard
              label="Year"
              value={activeCrisis.year}
              code="DATE"
              variant="danger"
              delay={0}
            />
            <StatCard
              label="Duration"
              value={activeCrisis.duration}
              code="TIME"
              variant="danger"
              delay={0.05}
            />
            <StatCard
              label="Ships affected"
              value={activeCrisis.shipsAffected}
              code="VES"
              variant="danger"
              delay={0.1}
            />
            <StatCard
              label="Status"
              value={activeCrisis.isOngoing ? "ONGOING" : "RESOLVED"}
              code={activeCrisis.isOngoing ? "LIVE" : "HIST"}
              variant="danger"
              delay={0.15}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cumulative impact callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="w-full rounded-sm border border-red-500/15 bg-red-500/[0.05] p-4 flex items-center gap-3"
        >
          <div className="w-1.5 h-10 bg-red-500/60 rounded-full flex-shrink-0" />
          <div>
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-red-400/60 mb-1">
              Total CO₂ Wasted — All Crises
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-red-300 tracking-tight">
              {formatCompact(CUMULATIVE_HISTORICAL_CO2_TONNES)}+
            </span>
            <span className="text-sm text-red-400/40 ml-2">tonnes</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
