import type { ThemeOptions } from "@mui/material/styles";

// ============================================================================
// DSL Types (Domain-Specific Language for Safe Code Transformation)
// ============================================================================

/**
 * DSL placeholder for theme.spacing() calls.
 * Represents a spacing function call that will be resolved later.
 *
 * @example
 * // User code: theme.spacing(2)
 * // DSL: { __type: 'spacing', args: [2] }
 */
export interface DslSpacingPlaceholder {
  __type: "spacing";
  args: [number];
}

/**
 * DSL placeholder for theme.palette.* token references.
 * Represents a palette token that will be resolved from template context.
 *
 * @example
 * // User code: theme.palette.primary.main
 * // DSL: { __type: 'token', path: 'palette.primary.main' }
 */
export interface DslTokenPlaceholder {
  __type: "token";
  path: string;
}

/**
 * DSL placeholder for theme.breakpoints.up() calls.
 * Represents a breakpoint query that will be converted to CSS media query.
 *
 * @example
 * // User code: [theme.breakpoints.up('md')]: { ... }
 * // DSL: { __type: 'breakpoint', breakpoint: 'md', direction: 'up' }
 */
export interface DslBreakpointPlaceholder {
  __type: "breakpoint";
  breakpoint: "xs" | "sm" | "md" | "lg" | "xl";
  direction: "up" | "down" | "only" | "between";
  endBreakpoint?: "xs" | "sm" | "md" | "lg" | "xl"; // for 'between'
}

/**
 * DSL placeholder for MUI helper functions (alpha, lighten, darken, etc.).
 *
 * @example
 * // User code: alpha('#fff', 0.5)
 * // DSL: { __type: 'helper', name: 'alpha', args: ['#fff', 0.5] }
 */
export interface DslHelperPlaceholder {
  __type: "helper";
  name: "alpha" | "lighten" | "darken" | "emphasize" | "getContrastRatio";
  args: (string | number | DslPlaceholder)[];
}

/**
 * DSL placeholder for arrow functions with theme parameter.
 * Stores the function body as DSL (not executable code).
 *
 * @example
 * // User code: ({ theme }) => ({ fontSize: theme.spacing(2) })
 * // DSL: { __type: 'function', params: ['theme'], body: { fontSize: { __type: 'spacing', args: [2] } } }
 */
export interface DslFunctionPlaceholder {
  __type: "function";
  params: string[]; // Usually ['theme'] or ['theme', 'ownerState']
  body: DslValue;
}

/**
 * Union of all DSL placeholder types.
 */
export type DslPlaceholder =
  | DslSpacingPlaceholder
  | DslTokenPlaceholder
  | DslBreakpointPlaceholder
  | DslHelperPlaceholder
  | DslFunctionPlaceholder;

/**
 * A value in DSL can be a literal, placeholder, array, or object.
 */
export type DslValue =
  | string
  | number
  | boolean
  | null
  | DslPlaceholder
  | DslValue[]
  | { [key: string]: DslValue };

/**
 * Complete DSL representation of ThemeOptions.
 * Nested structure matching ThemeOptions shape but with placeholders.
 */
export type ThemeDsl = {
  [K in keyof ThemeOptions]?: DslValue;
};

/**
 * Result of transforming user code to DSL.
 */
export interface DslTransformResult {
  /** Transformed DSL (safe JSON with placeholders) */
  dsl: ThemeDsl;

  /** Original source code (for round-trip editing) */
  source: string;

  /** Transform error, if any */
  error: string | null;

  /** Warnings (non-blocking issues) */
  warnings: string[];
}

/**
 * Context needed to resolve DSL placeholders to executable values.
 */
export interface DslResolutionContext {
  /** Base template theme (for token resolution) */
  template: ThemeOptions;

  /** Target color scheme */
  colorScheme: "light" | "dark";

  /** Base spacing factor (default: 8) */
  spacingFactor?: number;
}
