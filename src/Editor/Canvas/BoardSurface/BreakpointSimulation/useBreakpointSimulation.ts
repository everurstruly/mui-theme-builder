import { create } from "zustand";
import type { Theme, Breakpoint } from "@mui/material/styles";

type BreakpointSimulationState = {
  simulatedBreakpoint: Breakpoint | null;
  setSimulatedBreakpoint: (breakpoint: Breakpoint | null) => void;
};

export const useBreakpointSimulationStore = create<BreakpointSimulationState>(
  (set) => ({
    simulatedBreakpoint: null,
    setSimulatedBreakpoint: (breakpoint) =>
      set({ simulatedBreakpoint: breakpoint }),
  })
);

/**
 * Maximum widths for each breakpoint (upper bound before next breakpoint)
 */
export const BREAKPOINT_MAX_WIDTHS: Record<Breakpoint, number> = {
  xs: 360,
  sm: 600,
  md: 1024,
  lg: 1400,
  xl: 1800,
};

/**
 * Hook to access and control breakpoint simulation
 */
export function useBreakpointSimulation() {
  const simulatedBreakpoint = useBreakpointSimulationStore(
    (state) => state.simulatedBreakpoint
  );
  const setSimulatedBreakpoint = useBreakpointSimulationStore(
    (state) => state.setSimulatedBreakpoint
  );

  return {
    simulatedBreakpoint,
    setSimulatedBreakpoint,
    getMaxWidth: () => {
      if (!simulatedBreakpoint) return "100%";
      return `${BREAKPOINT_MAX_WIDTHS[simulatedBreakpoint]}px`;
    },
    getMinWidth: () => {
      if (!simulatedBreakpoint) return undefined;
      // For larger breakpoints, set min-width to prevent expanding beyond the breakpoint
      return `${BREAKPOINT_MAX_WIDTHS[simulatedBreakpoint]}px`;
    },
    getScale: (availableWidth?: number) => {
      if (!simulatedBreakpoint || !availableWidth) return 1;
      
      const breakpointWidth = BREAKPOINT_MAX_WIDTHS[simulatedBreakpoint];
      
      // If the breakpoint is larger than available space, scale it down
      if (breakpointWidth > availableWidth) {
        // Leave some padding (40px on each side)
        const padding = 80;
        return Math.max(0.3, (availableWidth - padding) / breakpointWidth);
      }
      
      return 1;
    },
  };
}

/**
 * Transforms a theme to spoof breakpoints for viewport simulation
 * @param theme - The original MUI theme
 * @param simulatedBreakpoint - The breakpoint to simulate (xs, sm, md, lg, xl)
 * @returns A new theme with spoofed breakpoint values and methods
 */
export function spoofThemeBreakpoints(
  theme: Theme,
  simulatedBreakpoint: Breakpoint | null
): Theme {
  if (!simulatedBreakpoint) {
    return theme;
  }

  // Get the breakpoint keys
  const breakpointKeys: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];
  const currentIndex = breakpointKeys.indexOf(simulatedBreakpoint);

  if (currentIndex === -1) {
    return theme;
  }

  // Create spoofed breakpoint values
  // We need to maintain the actual breakpoint values for components like Container
  // but adjust the media query generation to simulate the breakpoint
  const originalValues = theme.breakpoints.values;
  
  const spoofedValues = breakpointKeys.reduce(
    (acc, key) => {
      // Keep the original values - components like Container need these
      acc[key] = originalValues[key];
      return acc;
    },
    {} as Record<Breakpoint, number>
  );

  // Override the breakpoint helper methods to simulate the breakpoint
  // These methods control media queries which determine responsive behavior
  
  const spoofedUp = (key: Breakpoint | number) => {
    const value = typeof key === "number" ? key : spoofedValues[key];
    const keyIndex = typeof key === "number" ? -1 : breakpointKeys.indexOf(key);
    
    // If we're checking a breakpoint at or below our simulated one, always match
    if (keyIndex !== -1 && keyIndex <= currentIndex) {
      return `@media (min-width:0px)`;
    }
    // If checking above our simulated breakpoint, never match
    if (keyIndex !== -1 && keyIndex > currentIndex) {
      return `@media (min-width:999999px)`;
    }
    // For numeric values, compare to simulated width
    return `@media (min-width:${value}px)`;
  };

  const spoofedDown = (key: Breakpoint | number) => {
    const value = typeof key === "number" ? key : spoofedValues[key];
    const keyIndex = typeof key === "number" ? -1 : breakpointKeys.indexOf(key);
    
    // If we're checking a breakpoint below our simulated one, never match
    if (keyIndex !== -1 && keyIndex < currentIndex) {
      return `@media (max-width:0px)`;
    }
    // If checking at or above our simulated breakpoint, always match
    if (keyIndex !== -1 && keyIndex >= currentIndex) {
      return `@media (max-width:999999px)`;
    }
    return `@media (max-width:${value - 0.05}px)`;
  };

  const spoofedBetween = (start: Breakpoint | number, end: Breakpoint | number) => {
    const startValue = typeof start === "number" ? start : spoofedValues[start];
    const endValue = typeof end === "number" ? end : spoofedValues[end];
    const startIndex = typeof start === "number" ? -1 : breakpointKeys.indexOf(start);
    const endIndex = typeof end === "number" ? -1 : breakpointKeys.indexOf(end);
    
    // If simulated breakpoint is between start and end, match
    if (startIndex !== -1 && endIndex !== -1) {
      if (currentIndex >= startIndex && currentIndex < endIndex) {
        return `@media (min-width:0px)`;
      } else {
        return `@media (min-width:999999px)`;
      }
    }
    
    return `@media (min-width:${startValue}px) and (max-width:${endValue - 0.05}px)`;
  };

  const spoofedOnly = (key: Breakpoint) => {
    const keyIndex = breakpointKeys.indexOf(key);
    
    // If this is the simulated breakpoint, match
    if (keyIndex === currentIndex) {
      return `@media (min-width:0px)`;
    }
    // Otherwise, don't match
    return `@media (min-width:999999px)`;
  };

  const spoofedNot = (key: Breakpoint) => {
    const keyIndex = breakpointKeys.indexOf(key);
    
    // If this is NOT the simulated breakpoint, match
    if (keyIndex !== currentIndex) {
      return `@media (min-width:0px)`;
    }
    // Otherwise, don't match
    return `@media (min-width:999999px)`;
  };

  return {
    ...theme,
    breakpoints: {
      ...theme.breakpoints,
      values: spoofedValues,
      up: spoofedUp,
      down: spoofedDown,
      between: spoofedBetween,
      only: spoofedOnly,
      not: spoofedNot,
    },
  };
}

