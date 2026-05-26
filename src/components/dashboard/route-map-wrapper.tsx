"use client";

import dynamic from "next/dynamic";

/**
 * Client-side wrapper for RouteMap to allow `ssr: false` with next/dynamic.
 *
 * Next.js 15+ forbids `ssr: false` in Server Components, so we isolate
 * the dynamic import here in a thin client boundary.
 */
const RouteMapInner = dynamic(
  () =>
    import("@/components/dashboard/route-map").then((mod) => ({
      default: mod.RouteMap,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[400px] bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    ),
  }
);

export function RouteMapWrapper() {
  return <RouteMapInner />;
}
