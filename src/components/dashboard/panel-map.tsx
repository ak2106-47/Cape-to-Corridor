"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  RAIL_CORRIDOR_COORDS,
  RAIL_BRANCH_COORDS,
  CAPE_ROUTE_COORDS,
  SOLAR_FARM_STATIONS,
} from "@/lib/constants";

/**
 * A compact, focused Leaflet map for embedding inside a panel.
 *
 * - variant="cape"  →  Cape of Good Hope reroute (red dashed, bright)
 * - variant="rail"  →  Electric rail corridor (green solid) + solar markers
 *
 * Uses a brighter tile layer and thicker lines for maximum visibility.
 */

interface PanelMapProps {
  variant: "cape" | "rail";
  delay?: number;
}

export function PanelMap({ variant, delay = 0.6 }: PanelMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    let mapInstance: ReturnType<typeof import("leaflet")["map"]> | null = null;

    async function initMap() {
      const L = await import("leaflet");

      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)["_getIconUrl"];
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;

      mapInstance = L.map(mapRef.current, {
        center: [20, 35],
        zoom: 3,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        touchZoom: false,
      });

      // Brighter dark tile layer — "dark_all" shows labels for context
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(mapInstance);

      if (variant === "cape") {
        // ── Cape of Good Hope route (red, bright, thick dashed) ──
        const capeLatLngs = CAPE_ROUTE_COORDS.map(([lat, lng]) => L.latLng(lat, lng));

        // Outer glow line
        L.polyline(capeLatLngs, {
          color: "#ef4444",
          weight: 6,
          opacity: 0.25,
        }).addTo(mapInstance);

        // Main dashed line
        L.polyline(capeLatLngs, {
          color: "#f87171",
          weight: 3.5,
          opacity: 0.95,
          dashArray: "8, 10",
        }).addTo(mapInstance);

        // Start marker — Bahrain
        const startIcon = L.divIcon({
          html: `<div style="
            width:14px;height:14px;
            background:radial-gradient(circle,#ef4444 40%,#dc2626);
            border-radius:50%;
            border:2.5px solid #fca5a5;
            box-shadow:0 0 12px #ef444480, 0 0 24px #ef444440;
          "></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        L.marker(L.latLng(CAPE_ROUTE_COORDS[0][0], CAPE_ROUTE_COORDS[0][1]), { icon: startIcon })
          .addTo(mapInstance)
          .bindTooltip("Jubail", { permanent: true, direction: "right", className: "map-label-red", offset: [8, 0] });

        // End marker — Haifa
        const endIcon = L.divIcon({
          html: `<div style="
            width:14px;height:14px;
            background:radial-gradient(circle,#f97316 40%,#ea580c);
            border-radius:50%;
            border:2.5px solid #fdba74;
            box-shadow:0 0 12px #f9731680, 0 0 24px #f9731640;
          "></div>`,
          className: "",
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        const lastCape = CAPE_ROUTE_COORDS[CAPE_ROUTE_COORDS.length - 1];
        L.marker(L.latLng(lastCape[0], lastCape[1]), { icon: endIcon })
          .addTo(mapInstance)
          .bindTooltip("Iskenderun", { permanent: true, direction: "right", className: "map-label-red", offset: [8, 0] });

        // Cape point label
        const capeIcon = L.divIcon({
          html: `<div style="
            width:10px;height:10px;
            background:#ef4444;
            border-radius:50%;
            border:2px solid #fca5a5;
            box-shadow:0 0 8px #ef444480;
          "></div>`,
          className: "",
          iconSize: [10, 10],
          iconAnchor: [5, 5],
        });
        L.marker(L.latLng(-34.3568, 18.4741), { icon: capeIcon })
          .addTo(mapInstance)
          .bindTooltip("Cape of Good Hope", { permanent: true, direction: "bottom", className: "map-label-red", offset: [0, 6] });

        const bounds = L.latLngBounds(capeLatLngs);
        mapInstance.fitBounds(bounds, { padding: [25, 25] });
      } else {
        // ── Rail corridor (green solid, bright) ──
        const railLatLngs = RAIL_CORRIDOR_COORDS.map(([lat, lng]) => L.latLng(lat, lng));

        // Outer glow line
        L.polyline(railLatLngs, {
          color: "#10b981",
          weight: 8,
          opacity: 0.2,
        }).addTo(mapInstance);

        // Main line
        L.polyline(railLatLngs, {
          color: "#34d399",
          weight: 4,
          opacity: 0.95,
        }).addTo(mapInstance);

        // Branch line (glow)
        const branchLatLngs = RAIL_BRANCH_COORDS.map(([lat, lng]) => L.latLng(lat, lng));
        L.polyline(branchLatLngs, {
          color: "#10b981",
          weight: 8,
          opacity: 0.2,
        }).addTo(mapInstance);

        // Branch line (main)
        L.polyline(branchLatLngs, {
          color: "#34d399",
          weight: 4,
          opacity: 0.95,
        }).addTo(mapInstance);

        // Solar farm markers — bright, larger
        const solarIcon = L.divIcon({
          html: `<div style="
            width:12px;height:12px;
            background:radial-gradient(circle,#fbbf24 30%,#f59e0b 100%);
            border-radius:50%;
            border:2px solid #fde68a;
            box-shadow:0 0 10px #fbbf2480, 0 0 20px #fbbf2430;
          "></div>`,
          className: "",
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        });

        SOLAR_FARM_STATIONS.forEach((station) => {
          L.marker(L.latLng(station.coords[0], station.coords[1]), { icon: solarIcon }).addTo(mapInstance!);
        });

        // Start marker — Bahrain
        const startIcon = L.divIcon({
          html: `<div style="
            width:16px;height:16px;
            background:radial-gradient(circle,#10b981 40%,#059669);
            border-radius:50%;
            border:2.5px solid #6ee7b7;
            box-shadow:0 0 14px #10b98180, 0 0 28px #10b98140;
          "></div>`,
          className: "",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        L.marker(L.latLng(RAIL_CORRIDOR_COORDS[0][0], RAIL_CORRIDOR_COORDS[0][1]), { icon: startIcon })
          .addTo(mapInstance)
          .bindTooltip("Jubail", { permanent: true, direction: "right", className: "map-label-green", offset: [10, 0] });

        // End marker — Haifa
        const endIcon = L.divIcon({
          html: `<div style="
            width:16px;height:16px;
            background:radial-gradient(circle,#06b6d4 40%,#0891b2);
            border-radius:50%;
            border:2.5px solid #67e8f9;
            box-shadow:0 0 14px #06b6d480, 0 0 28px #06b6d440;
          "></div>`,
          className: "",
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });
        const lastRail = RAIL_CORRIDOR_COORDS[RAIL_CORRIDOR_COORDS.length - 1];
        L.marker(L.latLng(lastRail[0], lastRail[1]), { icon: endIcon })
          .addTo(mapInstance)
          .bindTooltip("Iskenderun", { permanent: true, direction: "left", className: "map-label-green", offset: [-10, 0] });

        // Branch end marker — Haifa
        const lastBranch = RAIL_BRANCH_COORDS[RAIL_BRANCH_COORDS.length - 1];
        L.marker(L.latLng(lastBranch[0], lastBranch[1]), { icon: endIcon })
          .addTo(mapInstance)
          .bindTooltip("Haifa", { permanent: true, direction: "bottom", className: "map-label-green", offset: [0, 8] });

        const bounds = L.latLngBounds([...railLatLngs, ...branchLatLngs]);
        mapInstance.fitBounds(bounds, { padding: [30, 30] });
      }

      setIsMapReady(true);
    }

    initMap();

    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, [variant]);

  const borderClass =
    variant === "cape"
      ? "border-red-500/30 shadow-red-500/10"
      : "border-emerald-500/30 shadow-emerald-500/10";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className={`relative w-full rounded-lg overflow-hidden border shadow-xl ${borderClass}`}
      style={{ height: "280px" }}
    >
      {/* Corner notches for HUD feel */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/15 z-10 rounded-tl-lg" aria-hidden />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/15 z-10 rounded-tr-lg" aria-hidden />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/15 z-10 rounded-bl-lg" aria-hidden />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/15 z-10 rounded-br-lg" aria-hidden />

      {/* Route label overlay */}
      <div className="absolute top-2.5 left-3.5 z-20 flex items-center gap-2 px-2 py-1 rounded-sm bg-black/60 backdrop-blur-sm">
        <div
          className={`w-2.5 h-2.5 rounded-full shadow-sm ${
            variant === "cape" ? "bg-red-500 shadow-red-500/50" : "bg-emerald-500 shadow-emerald-500/50"
          }`}
        />
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/70 font-medium">
          {variant === "cape" ? "Cape Reroute — 31,000+ km" : "Rail Corridor — 2,200 km"}
        </span>
      </div>

      {/* Loading state */}
      {!isMapReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#080810] z-30">
          <div className="flex items-center gap-2 text-white/40">
            <div
              className={`w-3.5 h-3.5 border-2 rounded-full animate-spin ${
                variant === "cape"
                  ? "border-red-500 border-t-transparent"
                  : "border-emerald-500 border-t-transparent"
              }`}
            />
            <span className="text-[10px] font-mono tracking-wider">LOADING MAP…</span>
          </div>
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />
    </motion.div>
  );
}
