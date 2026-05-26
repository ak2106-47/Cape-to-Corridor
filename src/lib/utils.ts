import { CRISIS_START_DATE, EXTRA_CO2_PER_DAY_TONNES } from "./constants";

/**
 * Returns the total extra CO₂ emitted (in tonnes) since the Hormuz closure,
 * calculated as a simple linear projection from the crisis start date.
 *
 * Used by the real-time ticker on the Problem panel.
 */
export function getExtraCO2SinceCrisis(): number {
  const now = new Date();
  const elapsedMs = Math.max(0, now.getTime() - CRISIS_START_DATE.getTime());
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
  return Math.round(elapsedDays * EXTRA_CO2_PER_DAY_TONNES);
}

/**
 * Returns the number of seconds elapsed since the crisis start date.
 * Used to drive per-second CO₂ rate for smooth ticker animation.
 */
export function getSecondsElapsed(): number {
  const now = new Date();
  return Math.max(0, (now.getTime() - CRISIS_START_DATE.getTime()) / 1000);
}

/**
 * Formats a large number with commas for display (e.g. 1234567 → "1,234,567").
 */
export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

/**
 * Formats a number with a unit suffix (K, M, B) for compact display.
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value).toString();
}

/** Clamps a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
