/**
 * Brand color tokens — derived from the HOME screen palette, reused app-wide.
 * Mirrors named tokens in tailwind.config.js. Use either:
 *   className="bg-brand-green"  OR  style={{ color: Colors.brandText }}
 * Dark mode uses standard Tailwind scale (slate-*, white, gray-400).
 * Splash/onboarding (app/index.tsx) intentionally excluded.
 */
export const Colors = {
  // Brand greens / text
  brandText: "#33422A",
  brandTextDeep: "#3D4A30",
  brandGreen: "#6D8B4F",
  brandGreenDark: "#566F3D",
  brandSage: "#8BA862",
  // Surfaces
  surfaceLight: "#F2F8E8",
  surfaceHighlight: "#C9E0A0",
  surfaceTrack: "#E3EDD0",
  surfaceTrackWarn: "#F2E3BE",
  // Borders
  edgeGreen: "#DCE8C8",
  edgeGreenSoft: "#C8D9AC",
  // Accent
  accentAmber: "#D9A441",
} as const;

export type ColorToken = (typeof Colors)[keyof typeof Colors];
