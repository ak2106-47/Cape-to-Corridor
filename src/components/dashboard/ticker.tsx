"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { EXTRA_CO2_PER_DAY_TONNES, CRISIS_START_DATE } from "@/lib/constants";
import { formatNumber } from "@/lib/utils";

/**
 * Animated ticker — big, bold, monospace numbers.
 *
 * The label is now large and color-coded so judges instantly understand
 * what the number represents (WASTED vs SAVED).
 */

interface TickerProps {
  label: string;
  unit: string;
  targetValue?: number;
  isRealtime?: boolean;
  animationDuration?: number;
  numberClassName?: string;
  /** Color class for the label (e.g. "text-red-400" or "text-emerald-400") */
  labelClassName?: string;
  suffix?: string;
}

export function Ticker({
  label,
  unit,
  targetValue = 0,
  isRealtime = false,
  animationDuration = 2000,
  numberClassName = "text-red-400",
  labelClassName = "text-white/50",
  suffix = "",
}: TickerProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const calculateRealtimeValue = useCallback((): number => {
    const now = new Date();
    const elapsedMs = Math.max(0, now.getTime() - CRISIS_START_DATE.getTime());
    const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
    return elapsedDays * EXTRA_CO2_PER_DAY_TONNES;
  }, []);

  useEffect(() => {
    if (isRealtime) {
      const tick = () => {
        setDisplayValue(calculateRealtimeValue());
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      const tick = (timestamp: number) => {
        if (startTimeRef.current === null) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / animationDuration, 1);
        // Slower ease-out curve (power of 4 instead of 3) for more dramatic build
        const eased = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(eased * targetValue);
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(tick);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [isRealtime, targetValue, animationDuration, calculateRealtimeValue]);

  return (
    <div className="flex flex-col items-center gap-2.5 w-full">
      {/* Label — BIG, bold, color-coded so judges get it instantly */}
      <span className={`text-sm sm:text-lg font-bold uppercase tracking-[0.15em] ${labelClassName}`}>
        {label}
      </span>

      {/* Number — massive and bold */}
      <div className="relative flex items-baseline justify-center">
        <span
          className={`text-5xl sm:text-6xl md:text-[4.5rem] font-mono font-extrabold tabular-nums tracking-tighter ${numberClassName}`}
        >
          {displayValue.toLocaleString("en-US", {
            minimumFractionDigits: isRealtime ? 2 : 0,
            maximumFractionDigits: isRealtime ? 2 : 0,
          })}
        </span>
        {/* Glow */}
        <div
          className={`absolute inset-0 blur-3xl opacity-15 -z-10 ${numberClassName}`}
          aria-hidden
        />
      </div>

      {/* Unit */}
      <div className="flex items-center gap-1 text-sm sm:text-base font-medium text-white/45">
        <span className="uppercase tracking-wider">{unit}</span>
        {suffix && (
          <span className="text-white/55 font-semibold">{suffix}</span>
        )}
      </div>
    </div>
  );
}
