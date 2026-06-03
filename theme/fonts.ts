/**
 * Font family tokens — derived from the HOME screen (app-wide source of truth).
 * Values are IDENTICAL to the strings already used — purely a rename.
 * Splash/onboarding (app/index.tsx) intentionally NOT migrated.
 */
export const Fonts = {
  regular: "Montserrat_400Regular",
  medium: "Montserrat_500Medium",
  semibold: "Montserrat_600SemiBold",
  bold: "Montserrat_700Bold",
} as const;

export type FontToken = (typeof Fonts)[keyof typeof Fonts];
