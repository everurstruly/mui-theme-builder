import { useMemo, useEffect, useRef } from "react";
import { useThemeDesignEditValue, useThemeDesignTheme, useThemeDesignStore } from "../../ThemeDesign";
import { createTheme } from "@mui/material/styles";

// In-memory map to suppress auto-generation immediately after user resets a derived shade.
const resetSuppressMap = new Map<string, boolean>();

// Hook: computes a derived palette shade (light/dark/contrastText) and shows it as Auto
// only when the parent main color is actively user-edited (not default, not after reset).
export default function useResolvedPaletteShade(path: string, name: string) {
  const editHook = useThemeDesignEditValue(path);
  const resolvedTheme = useThemeDesignTheme(); // MUI-resolved theme with correct derived shades
  const activeColorScheme = useThemeDesignStore((s) => s.activeColorScheme); // Get current mode directly

  const parts = path.split(".");
  const parentKey = parts.length >= 2 ? parts[1] : null;
  const parentHook = useThemeDesignEditValue(parentKey ? `palette.${parentKey}.main` : `palette.?.main`);

  const isDerived = ["light", "dark", "contrastText"].includes(name);
  const prevParentEditRef = useRef(parentHook.hasVisualEdit);

  // Use MUI's logic to compute derived shades from the live user-edited main color.
  // We create a minimal theme with just the user's edited main to get correct light/dark/contrastText.
  const resolvedShade = useMemo(() => {
    if (!isDerived || !parentKey) return undefined;

    // Get the live user-edited main color (or fall back to resolved theme's main)
    const paletteObj = resolvedTheme.palette as unknown as Record<string, unknown>;
    const parentEntry = paletteObj[parentKey] as Record<string, unknown> | undefined;
    const parentMain = parentHook.value || (parentEntry ? (parentEntry["main"] as string | undefined) : undefined);

    if (!parentMain) return undefined;

    try {
      // Let MUI compute the derived shades using its internal augmentColor logic
      // Use the active color scheme from store to ensure mode matches what user sees
      const tempTheme = createTheme({
        palette: {
          mode: activeColorScheme,
          [parentKey]: { main: parentMain },
        },
      });

      const tempPalette = tempTheme.palette as unknown as Record<string, unknown>;
      const tempEntry = tempPalette[parentKey] as Record<string, unknown> | undefined;
      return tempEntry ? (tempEntry[name] as string | undefined) : undefined;
    } catch {
      return undefined;
    }
  }, [isDerived, parentKey, parentHook.value, resolvedTheme, name, activeColorScheme]);

  // Detect when parent main is actively user-edited (not code-overridden).
  const parentIsActivelyEdited = parentHook ? parentHook.hasVisualEdit && !parentHook.hasCodeOverride : false;

  useEffect(() => {
    prevParentEditRef.current = parentHook.hasVisualEdit;
  }, [parentHook.hasVisualEdit]);

  // Check if this derived path is suppressed (user recently reset it).
  const isSuppressed = resetSuppressMap.get(path) || false;

  // Show as "Auto" only when parent is user-edited, not code-overridden, derived property
  // is not customized or overridden, and not suppressed by a recent Reset.
  const isResolved =
    Boolean(resolvedShade) &&
    isDerived &&
    !editHook.hasVisualEdit &&
    !editHook.hasCodeOverride &&
    parentIsActivelyEdited &&
    !isSuppressed;

  // Display the generated shade if Auto conditions met; otherwise use stored value or default.
  const displayValue = (isResolved ? resolvedShade : editHook.value) || "#000000";

  // Wrap reset so that:
  // - If the parent `main` is actively user-edited, Reset should restore Auto (no suppress).
  // - Otherwise (parent not edited), Reset should revert to default and suppress Auto briefly.
  const resetWithSuppress = () => {
    editHook.reset();
    if (!parentIsActivelyEdited) {
      resetSuppressMap.set(path, true);
      // Clear suppress flag after a short delay so future parent edits can re-enable Auto.
      setTimeout(() => resetSuppressMap.delete(path), 100);
    }
  };

  return {
    displayValue,
    resolvedShade,
    isResolved,
    setValue: editHook.setValue,
    reset: resetWithSuppress,
    hasVisualEdit: editHook.hasVisualEdit,
    hasCodeOverride: editHook.hasCodeOverride,
  };
}
