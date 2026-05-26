"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper for PanelMap to avoid `ssr: false` in Server Components.
 * Next.js 15+ forbids ssr:false in RSC, so the dynamic import lives here.
 */

const PanelMapInner = dynamic(
  () => import("@/components/dashboard/panel-map").then((mod) => ({ default: mod.PanelMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[200px] rounded-lg bg-[#0a0a12] border border-white/10 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/30">
          <div className="w-3 h-3 border-2 border-white/20 border-t-transparent rounded-full animate-spin" />
          <span className="text-[10px] font-mono">LOADING MAP…</span>
        </div>
      </div>
    ),
  }
);

interface PanelMapWrapperProps {
  variant: "cape" | "rail";
  delay?: number;
}

export function PanelMapWrapper({ variant, delay }: PanelMapWrapperProps) {
  return <PanelMapInner variant={variant} delay={delay} />;
}
