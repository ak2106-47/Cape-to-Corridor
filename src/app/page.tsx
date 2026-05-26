import { Header } from "@/components/dashboard/header";
import { ProblemPanel } from "@/components/dashboard/problem-panel";
import { SolutionPanel } from "@/components/dashboard/solution-panel";
import { EmissionsChart } from "@/components/dashboard/emissions-chart";

/**
 * Main dashboard page — the single entry point for the SpaceHack 2026
 * SpaceHack 2026 presentation.
 *
 * Layout:
 * ┌──────────────────────────────────────────┐
 * │              Header (branding)            │
 * ├──────────────────┬───┬───────────────────┤
 * │  Crisis Panel    │VS │  Solution Panel    │
 * │  ├ Ticker        │   │  ├ Ticker          │
 * │  ├ Cape Map      │   │  ├ Rail Map        │
 * │  ├ Stats         │   │  ├ Stats           │
 * │  └ Callout       │   │  └ Callout         │
 * ├──────────────────┴───┴───────────────────┤
 * │         Emissions Trajectory Chart        │
 * └──────────────────────────────────────────┘
 */
export default function DashboardPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#030306]">
      {/* Header */}
      <Header />

      {/* Split panels */}
      <section
        className="relative flex flex-col lg:flex-row flex-1"
        id="dashboard-panels"
      >
        {/* Left: Crisis */}
        <div className="relative flex-1">
          <ProblemPanel />
        </div>

        {/* Center divider with VS badge */}
        <div className="hidden lg:flex flex-col items-center justify-center relative z-20">
          {/* Vertical glow line */}
          <div className="absolute inset-y-0 w-px bg-gradient-to-b from-red-500/30 via-white/10 to-emerald-500/30 divider-glow" />

          {/* VS badge */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-14 h-14 rounded-full bg-white/[0.03] pulse-ring" />
            <div className="relative w-10 h-10 rounded-sm bg-[#030306] border border-white/10 flex items-center justify-center shadow-2xl">
              <span className="text-[10px] font-mono font-bold text-white/50 tracking-widest">
                VS
              </span>
            </div>
          </div>
        </div>

        {/* Mobile divider */}
        <div className="flex lg:hidden items-center justify-center py-2 relative">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-red-500/30 via-white/10 to-emerald-500/30" />
          <div className="relative w-8 h-8 rounded-sm bg-[#030306] border border-white/10 flex items-center justify-center z-10">
            <span className="text-[9px] font-mono font-bold text-white/40 tracking-widest">
              VS
            </span>
          </div>
        </div>

        {/* Right: Solution */}
        <div className="relative flex-1">
          <SolutionPanel />
        </div>
      </section>

      {/* Emissions Chart */}
      <section id="emissions-chart-section">
        <EmissionsChart />
      </section>

      {/* Footer */}
      <footer className="px-4 sm:px-6 py-3 bg-[#030306] border-t border-white/[0.04] flex items-center justify-between">
        <span className="text-[10px] font-mono text-white/20 tracking-wider">
          NET-ZERO SUPPLY CHAIN · SPACEHACK 2026
        </span>
        <span className="text-[10px] font-mono text-white/15">
          DATA: Maritime Industry Reports 2024–2026
        </span>
      </footer>
    </main>
  );
}
