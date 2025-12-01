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
  
  // Boost saturation for more vibrant shades
  const targetSaturation = Math.max(hsl.s, Math.min(0.9, hsl.s * 1.3));
  
  // Try increasingly aggressive adjustments
  const attempts = isLight 
    ? [0.15, 0.10, 0.05, 0.02, 0] // Target lightness for light backgrounds
    : [0.85, 0.90, 0.95, 0.98, 1]; // Target lightness for dark backgrounds
  
  for (const targetL of attempts) {
    const candidate = tinycolor({ h: hsl.h, s: targetSaturation, l: targetL });
    
    if (tinycolor.readability(base, candidate) >= minContrast) {
      return candidate.toHexString();
    }
  }
  
  // Try complementary color with aggressive adjustments
  const complementaryH = (hsl.h + 180) % 360;
  for (const targetL of attempts) {
    const candidate = tinycolor({ h: complementaryH, s: targetSaturation, l: targetL });
    
    if (tinycolor.readability(base, candidate) >= minContrast) {
      return candidate.toHexString();
    }
  }
  
  // Last resort: pure black or white
  return isLight ? "#000000" : "#FFFFFF";
}

// Installation: npm install tinycolor2
// Usage examples:
// generateReadableColorShade("#3B82F6")
// generateReadableColorShade("hsl(210, 100%, 65%)")
// generateReadableColorShade("rgb(59, 130, 246)")
// generateReadableColorShade("blue")