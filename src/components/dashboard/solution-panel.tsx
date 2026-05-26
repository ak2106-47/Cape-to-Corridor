"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ticker } from "./ticker";
import { StatCard } from "./stat-card";
import { PanelMapWrapper } from "./panel-map-wrapper";
import {
  RAIL_ROUTE_DISTANCE_KM,
  RAIL_TRANSIT_HOURS,
  SHIP_TRANSIT_DAYS,
  SOLAR_CAPACITY_GW,
  ANNUAL_CO2_SAVINGS_TONNES,
} from "@/lib/constants";

/**
 * Right panel — the electric rail solution.
 * Bigger text, simpler language, instantly scannable by judges.
 */

const TIME_PERIODS = [
  { label: "1 Year", key: "1y", multiplier: 1 },
  { label: "5 Years", key: "5y", multiplier: 5 },
  { label: "10 Years", key: "10y", multiplier: 10 },
  { label: "25 Years", key: "25y", multiplier: 25 },
] as const;

type PeriodKey = (typeof TIME_PERIODS)[number]["key"];

export function SolutionPanel() {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodKey>("1y");

  const activePeriod = TIME_PERIODS.find((p) => p.key === selectedPeriod)!;
  const savingsValue = ANNUAL_CO2_SAVINGS_TONNES * activePeriod.multiplier;

  return (
    <div className="relative flex flex-col items-center h-full px-5 sm:px-8 py-6 sm:py-8 overflow-hidden tech-grid-bg scanline-overlay">
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-emerald-950/50 via-[#030a06] to-[#030306] pointer-events-none"
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
          <div className="w-1.5 h-7 bg-emerald-500 rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-400 uppercase tracking-wide">
            Our Solution
          </h2>
        </motion.div>

        {/* Description — simple, direct */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-white/55 text-sm sm:text-base leading-relaxed"
        >
          A{" "}
          <span className="text-emerald-300 font-semibold">
            solar-powered electric rail corridor
          </span>{" "}
          from Jubail to the Mediterranean — bypassing every maritime chokepoint with{" "}
          <span className="text-emerald-300 font-semibold">net-zero emissions.</span>
        </motion.p>

        {/* Time period selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="w-full"
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-white/35">
              CO₂ Savings Over Time
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {TIME_PERIODS.map((period) => {
              const isActive = period.key === selectedPeriod;
              return (
                <button
                  key={period.key}
                  onClick={() => setSelectedPeriod(period.key)}
                  className={`
                    relative px-2 py-2.5 text-center transition-all duration-200
                    font-mono text-[11px] sm:text-xs tracking-wider uppercase font-medium
                    border rounded-sm
                    ${
                      isActive
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10"
                        : "bg-white/[0.02] border-white/[0.06] text-white/35 hover:text-white/55 hover:border-white/15"
                    }
                  `}
                >
                  {isActive && (
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-emerald-500 rounded-t-sm" />
                  )}
                  {period.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* CO₂ savings ticker */}
        <div className="w-full py-4 border-y border-emerald-500/10">
          <Ticker
            key={selectedPeriod}
            label={`CO₂ Saved — ${activePeriod.label}`}
            unit="tonnes of CO₂"
            targetValue={savingsValue}
            animationDuration={8000}
            numberClassName="text-emerald-400"
            labelClassName="text-emerald-400/80"
          />
        </div>

        {/* Rail corridor map */}
        <PanelMapWrapper variant="rail" delay={0.5} />

        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <StatCard
            label="Route length"
            value={`${RAIL_ROUTE_DISTANCE_KM.toLocaleString()} km`}
            code="DIST"
            variant="success"
            delay={0.7}
          />
          <StatCard
            label="Transit time"
            value={`${RAIL_TRANSIT_HOURS} hrs`}
            code="TIME"
            variant="success"
            delay={0.75}
          />
          <StatCard
            label="Solar power"
            value={`${SOLAR_CAPACITY_GW} GW`}
            code="PWR"
            variant="success"
            delay={0.8}
          />
          <StatCard
            label="Emissions"
            value="Net Zero"
            code="CO₂"
            variant="success"
            delay={0.85}
          />
        </div>

        {/* Speed advantage callout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="w-full rounded-sm border border-emerald-500/15 bg-emerald-500/[0.05] p-4 flex items-center gap-3"
        >
          <div className="w-1.5 h-10 bg-emerald-500/60 rounded-full flex-shrink-0" />
          <div>
            <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400/60 mb-1">
              Speed Advantage
            </div>
            <span className="text-2xl sm:text-3xl font-mono font-bold text-emerald-300 tracking-tight">
              38× Faster
            </span>
            <span className="text-sm text-emerald-400/40 ml-2">than rerouted shipping</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
