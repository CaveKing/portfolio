import { ACCENT_COLORS } from "@/constants";

/** Deterministically pick an accent color from a seed string (e.g. username). */
export function colorFromString(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}
