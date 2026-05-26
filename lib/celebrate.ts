"use client";

import confetti from "canvas-confetti";

/**
 * Brand-tinted confetti — mint, forest green, amber, cream.
 * Use to nudge the realtor when they cross a small completion milestone.
 * Keep it short and modest — no screen takeovers.
 */
const BRAND_COLORS = ["#00d9a3", "#2e7d5b", "#e8b341", "#f5e6c8"];

export function celebrate(intensity: 1 | 2 | 3 = 1) {
  if (typeof window === "undefined") return;
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (reduceMotion) return;

  const count = intensity === 1 ? 60 : intensity === 2 ? 110 : 180;
  const spread = intensity === 1 ? 60 : 75;
  // Two bursts from the bottom corners feels calmer than a centre cannon.
  confetti({
    particleCount: Math.floor(count / 2),
    angle: 60,
    spread,
    origin: { x: 0, y: 0.85 },
    colors: BRAND_COLORS,
    scalar: 0.9,
    ticks: 220,
  });
  confetti({
    particleCount: Math.floor(count / 2),
    angle: 120,
    spread,
    origin: { x: 1, y: 0.85 },
    colors: BRAND_COLORS,
    scalar: 0.9,
    ticks: 220,
  });
}
