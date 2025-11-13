import type { ThemeOptions } from '@mui/material/styles';
import { alpha as muiAlpha, darken as muiDarken, lighten as muiLighten } from '@mui/material/styles';
import type {
  ThemeDsl,
  DslValue,
  DslPlaceholder,
  DslResolutionContext,
} from './types';
import { getNestedValue } from './themeDesign.utils';

/**
 * Transforms DSL representation back to executable ThemeOptions.
 * 
 * This function:
 * 1. Walks the DSL structure
 * 2. Resolves placeholders using controlled implementations
 * 3. Builds executable ThemeOptions with real functions
 * 4. Never executes user code (only OUR implementations)
 * 
 * @param dsl - DSL representation with placeholders
 * @param context - Resolution context (template, color scheme, etc.)
 * @returns Executable ThemeOptions ready for createTheme()
 * 
 * @example
 * const dsl = {
 *   components: {
 *     MuiButton: {
 *       styleOverrides: {
 *         root: {
 *           __type: 'function',
 *           params: ['theme'],
 *           body: {
 *             fontSize: { __type: 'spacing', args: [2] }
 *           }
 *         }
 *       }
 *     }
 *   }
 * };
 * 
 * const themeOptions = transformDslToThemeOptions(dsl, {
 *   template: materialTemplate,
 *   colorScheme: 'light',
 *   spacingFactor: 8
 * });
 */
export function transformDslToThemeOptions(
  dsl: ThemeDsl,
  context: DslResolutionContext
): ThemeOptions {
  return resolveDslValue(dsl, context) as ThemeOptions;
}

/**
 * Recursively resolves a DSL value to an executable value.
 */
function resolveDslValue(value: DslValue, context: DslResolutionContext): unknown {
  // Null/undefined
  if (value === null || value === undefined) {
    return value;
  }

  // Primitive literals
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  // Array
  if (Array.isArray(value)) {
    return value.map((item) => resolveDslValue(item, context));
  }

  // Check if it's a DSL placeholder
  if (typeof value === 'object' && '__type' in value) {
    return resolvePlaceholder(value as DslPlaceholder, context);
  }

  // Plain object - recursively resolve properties
  if (typeof value === 'object') {
    const resolved: Record<string, unknown> = {};
    
    for (const [key, val] of Object.entries(value)) {
      // Handle media query keys from breakpoint placeholders
      if (key.startsWith('@media-')) {
        // Convert DSL media key to actual CSS media query
        const resolvedKey = resolveMediaQueryKey(key, context);
        resolved[resolvedKey] = resolveDslValue(val, context);
      } else {
        resolved[key] = resolveDslValue(val, context);
      }
    }
    
    return resolved;
  }

  return value;
}

/**
 * Resolves a DSL placeholder to an executable value.
 */
function resolvePlaceholder(placeholder: DslPlaceholder, context: DslResolutionContext): unknown {
  switch (placeholder.__type) {
    case 'spacing':
      return resolveSpacingPlaceholder(placeholder.args[0], context);

    case 'token':
      return resolveTokenPlaceholder(placeholder.path, context);

    case 'breakpoint':
      return resolveBreakpointPlaceholder(
        placeholder.breakpoint,
        placeholder.direction,
        placeholder.endBreakpoint,
        context
      );

    case 'helper':
      return resolveHelperPlaceholder(placeholder.name, placeholder.args, context);

    case 'function':
      return resolveFunctionPlaceholder(placeholder.params, placeholder.body, context);

    default:
      console.warn('Unknown DSL placeholder type:', (placeholder as DslPlaceholder).__type);
      return null;
  }
}

/**
 * Resolves theme.spacing(n) to actual spacing value.
 * Returns a function or computed value depending on usage context.
 */
function resolveSpacingPlaceholder(factor: number, context: DslResolutionContext): unknown {
  const baseSpacing = context.spacingFactor || 8;
  
  // Return computed value (most common case for style properties)
  return baseSpacing * factor;
}

/**
 * Resolves theme.palette.* token to actual color value from template.
 */
function resolveTokenPlaceholder(path: string, context: DslResolutionContext): unknown {
  // Get value from template theme
  const value = getNestedValue(context.template as Record<string, unknown>, path);
  
  if (value === undefined) {
    console.warn(`Token not found in template: ${path}`);
    return '';
  }
  
  return value;
}

/**
 * Resolves theme.breakpoints.up('md') to CSS media query string.
 */
function resolveBreakpointPlaceholder(
  breakpoint: string,
  direction: string,
  endBreakpoint: string | undefined,
  context: DslResolutionContext
): string {
  // Default MUI breakpoint values (should match template breakpoints)
  const breakpoints: Record<string, number> = {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  };

  // Try to get breakpoints from template
  const templateBreakpoints = context.template.breakpoints;
  if (templateBreakpoints && typeof templateBreakpoints === 'object' && 'values' in templateBreakpoints) {
    const values = (templateBreakpoints as { values: Record<string, number> }).values;
    Object.assign(breakpoints, values);
  }

  const value = breakpoints[breakpoint] || 0;

  switch (direction) {
    case 'up':
      return `@media (min-width:${value}px)`;
    
    case 'down':
      return `@media (max-width:${value - 0.05}px)`;
    
    case 'only': {
      const keys = Object.keys(breakpoints);
      const currentIndex = keys.indexOf(breakpoint);
      const nextKey = keys[currentIndex + 1];
      const nextValue = nextKey ? breakpoints[nextKey] : 999999;
      return `@media (min-width:${value}px) and (max-width:${nextValue - 0.05}px)`;
    }
    
    case 'between': {
      if (!endBreakpoint) {
        console.warn(`breakpoints.between() requires end breakpoint`);
        return `@media (min-width:${value}px)`;
      }
      const endValue = breakpoints[endBreakpoint] || 999999;
      return `@media (min-width:${value}px) and (max-width:${endValue - 0.05}px)`;
    }
    
    default:
      return `@media (min-width:${value}px)`;
  }
}

/**
 * Resolves MUI helper functions (alpha, lighten, darken, etc.).
 */
function resolveHelperPlaceholder(
  name: string,
  args: (string | number | DslPlaceholder)[],
  context: DslResolutionContext
): unknown {
  // Resolve arguments first (in case they contain placeholders)
  const resolvedArgs = args.map((arg) => {
    if (typeof arg === 'object' && '__type' in arg) {
      return resolvePlaceholder(arg as DslPlaceholder, context);
    }
    return arg;
  });

  switch (name) {
    case 'alpha': {
      const [color, opacity] = resolvedArgs as [string, number];
      return muiAlpha(color, opacity);
    }
    
    case 'lighten': {
      const [color, coefficient] = resolvedArgs as [string, number];
      return muiLighten(color, coefficient);
    }
    
    case 'darken': {
      const [color, coefficient] = resolvedArgs as [string, number];
      return muiDarken(color, coefficient);
    }
    
    case 'emphasize': {
      // emphasize is a MUI v5/v6 helper that lightens in dark mode and darkens in light mode
      const [color, coefficient] = resolvedArgs as [string, number];
      return context.colorScheme === 'dark'
        ? muiLighten(color, coefficient)
        : muiDarken(color, coefficient);
    }
    
    case 'getContrastRatio': {
      // This is a utility that returns a number, not a color
      // For now, return a placeholder value
      console.warn('getContrastRatio is not fully implemented');
      return 4.5;
    }
    
    default:
      console.warn(`Unknown helper function: ${name}`);
      return '';
  }
}

/**
 * Resolves arrow function placeholder to actual function.
 * Builds a runtime function that resolves placeholders when called.
 */
function resolveFunctionPlaceholder(
  _params: string[], // Params are implicit in the runtime function signature
  body: DslValue,
  context: DslResolutionContext
): unknown {
  // Create a runtime function that resolves the body DSL when called
  // The function signature matches MUI's expected format: ({ theme, ownerState }) => styles
  
  return (props: { theme?: unknown; ownerState?: unknown }) => {
    // Build a new context with theme from runtime props if available
    const runtimeContext: DslResolutionContext = {
      ...context,
      // If the runtime provides a theme, use it for token resolution
      template: (props.theme as ThemeOptions) || context.template,
    };
    
    // Resolve the body DSL with runtime context
    return resolveDslValue(body, runtimeContext);
  };
}

/**
 * Converts DSL media query key (@media-up-md) to actual CSS media query.
 */
function resolveMediaQueryKey(key: string, context: DslResolutionContext): string {
  // Parse key format: @media-{direction}-{breakpoint}
  const match = /^@media-(up|down|only|between)-(.+)$/.exec(key);
  
  if (!match) {
    return key; // Return as-is if format doesn't match
  }
  
  const [, direction, breakpoint] = match;
  return resolveBreakpointPlaceholder(breakpoint, direction, undefined, context);
}
