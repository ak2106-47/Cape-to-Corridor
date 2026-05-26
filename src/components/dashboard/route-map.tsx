"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  RAIL_CORRIDOR_COORDS,
  CAPE_ROUTE_COORDS,
  SOLAR_FARM_STATIONS,
} from "@/lib/constants";

/**
 * Interactive map showing both routes overlaid:
 * - Red dashed line: Cape of Good Hope shipping reroute
 * - Green solid line: Proposed electric rail corridor
 * - Yellow markers: Solar farm stations
 *
 * Uses Leaflet for rendering. Dynamic import required because Leaflet
 * accesses `window` which doesn't exist during SSR.
 */
export function RouteMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    let mapInstance: ReturnType<typeof import("leaflet")["map"]> | null = null;

    async function initMap() {
      const L = await import("leaflet");

      // Fix default marker icon paths (webpack breaks them)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)["_getIconUrl"];
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;

      mapInstance = L.map(mapRef.current, {
        center: [20, 30],
        zoom: 3,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: true,
      });

      // Dark tile layer for that premium feel
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(mapInstance);

      // Cape of Good Hope route (red dashed)
      const capeLatLngs = CAPE_ROUTE_COORDS.map(([lat, lng]) => L.latLng(lat, lng));
      L.polyline(capeLatLngs, {
        color: "#ef4444",
        weight: 3,
        opacity: 0.8,
        dashArray: "8, 12",
      })
        .addTo(mapInstance)
        .bindPopup(
          `<div style="font-family: system-ui; padding: 4px;">
            <strong style="color: #ef4444;">Cape of Good Hope Reroute</strong><br/>
            <span style="font-size: 12px; opacity: 0.8;">+6,000 NM | +15 days | +4,300t CO₂/ship</span>
          </div>`
        );

      // Rail corridor (green solid)
      const railLatLngs = RAIL_CORRIDOR_COORDS.map(([lat, lng]) => L.latLng(lat, lng));
      L.polyline(railLatLngs, {
        color: "#10b981",
        weight: 4,
        opacity: 0.9,
      })
        .addTo(mapInstance)
        .bindPopup(
          `<div style="font-family: system-ui; padding: 4px;">
            <strong style="color: #10b981;">Electric Rail Corridor</strong><br/>
            <span style="font-size: 12px; opacity: 0.8;">2,200 km | 22 hrs | Net-Zero CO₂</span>
          </div>`
        );

      // Solar farm markers (yellow/amber circles)
      const solarIcon = L.divIcon({
        html: `<div style="
          width: 14px; height: 14px;
          background: radial-gradient(circle, #fbbf24 40%, #f59e0b 100%);
          border-radius: 50%;
          border: 2px solid #fde68a;
          box-shadow: 0 0 8px #fbbf2480;
        "></div>`,
        className: "",
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      SOLAR_FARM_STATIONS.forEach((station) => {
        L.marker(L.latLng(station.coords[0], station.coords[1]), {
          icon: solarIcon,
        })
          .addTo(mapInstance!)
          .bindPopup(
            `<div style="font-family: system-ui; padding: 4px;">
              <strong style="color: #fbbf24;">☀️ ${station.name}</strong><br/>
              <span style="font-size: 12px; opacity: 0.8;">${station.capacityMW} MW capacity</span>
            </div>`
          );
      });

      // Start/end markers
      const startIcon = L.divIcon({
        html: `<div style="
          width: 18px; height: 18px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid #34d399;
          box-shadow: 0 0 12px #10b98180;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        ">🚢</div>`,
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      const endIcon = L.divIcon({
        html: `<div style="
          width: 18px; height: 18px;
          background: #06b6d4;
          border-radius: 50%;
          border: 3px solid #67e8f9;
          box-shadow: 0 0 12px #06b6d480;
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
        ">🏁</div>`,
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker(L.latLng(RAIL_CORRIDOR_COORDS[0][0], RAIL_CORRIDOR_COORDS[0][1]), {
        icon: startIcon,
      })
        .addTo(mapInstance)
        .bindPopup('<strong>Bahrain</strong><br/>Starting point');

      L.marker(
        L.latLng(
          RAIL_CORRIDOR_COORDS[RAIL_CORRIDOR_COORDS.length - 1][0],
          RAIL_CORRIDOR_COORDS[RAIL_CORRIDOR_COORDS.length - 1][1]
        ),
        { icon: endIcon }
      )
        .addTo(mapInstance)
        .bindPopup('<strong>Haifa</strong><br/>Mediterranean terminus');

      // Fit map to show both routes
      const allCoords = [...CAPE_ROUTE_COORDS, ...RAIL_CORRIDOR_COORDS];
      const bounds = L.latLngBounds(allCoords.map(([lat, lng]) => L.latLng(lat, lng)));
      mapInstance.fitBounds(bounds, { padding: [30, 30] });

      setIsMapReady(true);
    }

    initMap();

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.3, duration: 0.8 }}
      className="relative w-full"
    >
      {/* Section header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-4 sm:px-8 py-4 bg-black/60 backdrop-blur-sm border-t border-white/10">
        <div className="flex items-center gap-3 mb-2 sm:mb-0">
          <span className="text-xl">🗺️</span>
          <h3 className="text-sm sm:text-base font-bold text-white/90 uppercase tracking-wider">
            Route Comparison
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 sm:gap-6 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 bg-red-500" style={{ borderTop: "2px dashed #ef4444" }} />
            <span className="text-red-300">Cape Reroute (31,000+ km)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-0.5 bg-emerald-500" />
            <span className="text-emerald-300">Rail Corridor (2,200 km)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/50" />
            <span className="text-amber-300">Solar Farms</span>
          </div>
        </div>
      </div>

      {/* Map container */}
      <div className="relative" style={{ height: "400px" }}>
        {!isMapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
            <div className="flex items-center gap-3 text-white/60">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Loading map...</span>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" id="route-map" />
      </div>
    </motion.div>
  );
}
