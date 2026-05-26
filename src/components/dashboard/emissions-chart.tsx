"use client";

import { motion } from "framer-motion";
import { MONTHLY_EMISSIONS_DATA } from "@/lib/constants";

/**
 * Technical bar chart comparing monthly emissions with vs without the
 * rail solution. Pure CSS bars — no heavy chart library.
 */
export function EmissionsChart() {
  const maxValue = Math.max(
    ...MONTHLY_EMISSIONS_DATA.map((d) =>
      Math.max(d.emissionsWithReroute, d.emissionsWithRail)
    )
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="w-full px-4 sm:px-6 py-5 bg-[#030306] border-t border-white/[0.04] tech-grid-bg"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-1 h-4 bg-white/20 rounded-full" />
          <h3 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-[0.15em]">
            Emissions Trajectory
          </h3>
          <span className="text-[9px] font-mono text-white/20 tracking-wider">
            2026.MONTHLY
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/70" />
            <span className="text-red-400/60 tracking-wider">REROUTE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500/70" />
            <span className="text-emerald-400/60 tracking-wider">ELECTRIC RAIL</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm border border-white/20" />
            <span className="text-white/30 tracking-wider">BASELINE</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-1 sm:gap-1.5 h-40 sm:h-48">
        {MONTHLY_EMISSIONS_DATA.map((point, index) => {
          const rerouteHeight = (point.emissionsWithReroute / maxValue) * 100;
          const railHeight = (point.emissionsWithRail / maxValue) * 100;
          const baselineHeight = (point.baselineEmissions / maxValue) * 100;
          const isCrisisMonth = index >= 2;

          return (
            <div
              key={point.month}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div className="relative w-full flex items-end justify-center gap-[2px] h-40 sm:h-48">
                {/* Reroute bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${rerouteHeight}%` }}
                  transition={{ delay: 1.3 + index * 0.06, duration: 0.4 }}
                  className={`w-[35%] ${
                    isCrisisMonth
                      ? "bg-gradient-to-t from-red-800 to-red-500"
                      : "bg-gradient-to-t from-red-900/40 to-red-800/40"
                  }`}
                  style={{ borderRadius: "1px 1px 0 0" }}
                  title={`${point.month}: ${point.emissionsWithReroute}K tonnes (reroute)`}
                />

                {/* Rail bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${railHeight}%` }}
                  transition={{ delay: 1.35 + index * 0.06, duration: 0.4 }}
                  className="w-[35%] bg-gradient-to-t from-emerald-800 to-emerald-500"
                  style={{ borderRadius: "1px 1px 0 0" }}
                  title={`${point.month}: ${point.emissionsWithRail}K tonnes (Electric Rail)`}
                />

                {/* Baseline line */}
                <div
                  className="absolute left-0 right-0 border-t border-dashed border-white/10"
                  style={{ bottom: `${baselineHeight}%` }}
                />
              </div>

              {/* Month label */}
              <span className="text-[8px] sm:text-[9px] font-mono text-white/25 truncate w-full text-center tracking-wider">
                {point.month.split(" ")[0].substring(0, 3).toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Crisis annotation */}
      <div className="flex items-center justify-center mt-3 gap-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-red-500/20" />
        <span className="text-[9px] font-mono text-white/20 tracking-wider whitespace-nowrap">
          HORMUZ CLOSURE → MAR 2026
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-red-500/20" />
      </div>
    </motion.div>
  );
}
