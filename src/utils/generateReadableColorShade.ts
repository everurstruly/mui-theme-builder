import tinycolor from 'tinycolor2';

/**
 * Generate a readable colored shade from any background color.
 * Supports all color formats: hex, rgb, hsl, named colors, etc.
 * 
 * @param bgColor - Background color in any valid format
 * @param minContrast - Minimum WCAG contrast ratio (default: 4.5)
 * @returns Hex color that contrasts well with background
 */
export default function generateReadableColorShade(
  bgColor: string, 
  minContrast: number = 4.5
): string {
  const base = tinycolor(bgColor);
  
  if (!base.isValid()) {
    // Return safe fallback for invalid/incomplete colors
    return "#000000";
  }

  const hsl = base.toHsl();
  const isLight = hsl.l > 0.5;
  
  // Instead of moving to absolute white/black, nudge lightness away from
  // the background toward higher contrast while staying visually closer
  // to the original color. Use relative deltas from the background lightness
  // and a mild saturation boost so lighter candidates don't look washed-out.
  const saturationBoost = 0.1;
  const targetSaturation = Math.min(0.95, hsl.s * (1 + saturationBoost) + 0.02);
  // Very small lightness nudge to avoid "disabled" appearance
  const brightnessNudge = 0.03;

  // Relative lightness deltas from the background (larger first)
  const deltas = [0.40, 0.30, 0.20, 0.12, 0.06];

  for (const delta of deltas) {
    const candidateL = isLight
      ? Math.max(0, hsl.l - delta + brightnessNudge)
      : Math.min(1, hsl.l + delta + brightnessNudge);
    const candidate = tinycolor({ h: hsl.h, s: targetSaturation, l: candidateL });

    if (tinycolor.readability(base, candidate) >= minContrast) {
      return candidate.toHexString();
    }
  }

  // Try complementary hues as a fallback but keep deltas smaller to avoid
  // landing too close to pure white/black which looks like "washed out".
  const complementaryH = (hsl.h + 180) % 360;
  const compDeltas = [0.30, 0.20, 0.12, 0.06, 0.03];

  for (const delta of compDeltas) {
    const candidateL = isLight
      ? Math.max(0, hsl.l - delta + brightnessNudge)
      : Math.min(1, hsl.l + delta + brightnessNudge);
    const candidate = tinycolor({ h: complementaryH, s: targetSaturation, l: candidateL });

    if (tinycolor.readability(base, candidate) >= minContrast) {
      return candidate.toHexString();
    }
  }

  // Final fallback: pick a mix closer to the original color rather than pure
  // black/white so it visually relates to the background.
  const fallback = isLight
    ? tinycolor.mix(base.toHexString(), '#000000', 70)
    : tinycolor.mix(base.toHexString(), '#FFFFFF', 70);

  return fallback.toHexString();
}

// Installation: npm install tinycolor2
// Usage examples:
// generateReadableColorShade("#3B82F6")
// generateReadableColorShade("hsl(210, 100%, 65%)")
// generateReadableColorShade("rgb(59, 130, 246)")
// generateReadableColorShade("blue")