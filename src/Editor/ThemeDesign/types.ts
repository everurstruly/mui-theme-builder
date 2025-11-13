import type { ThemeOptions } from '@mui/material/styles';

/**
 * Serializable primitive values that can be stored and transmitted.
 * Excludes functions, which must be stored separately as strings.
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * Reference to a base theme template.
 */
export type ThemeTemplateRef = {
  /** 'builtin' for static templates, 'imported' for user-provided */
  type: 'builtin' | 'imported';
  /** Template identifier (e.g., 'material', 'fluent') */
  id: string;
};

/**
 * A composable is a reusable, toggleable theme modification.
 * Examples: "Dense spacing", "High contrast", "Rounded corners"
 */
export interface ThemeComposable {
  id: string;
  label: string;
  description?: string;
  /** Function that returns ThemeOptions for given color scheme */
  getOptions: (colorScheme: 'light' | 'dark') => ThemeOptions;
}

/**
 * Color-scheme-specific modifications (light or dark mode).
 * Only stores UI-based visual edits for palette and shadows.
 * Code overrides are global and stored at root level.
 */
export interface ColorSchemeEdits {
  /** Visual edits for color-scheme paths (palette.*, shadows) */
  visualEdits: Record<string, SerializableValue>;
}

/**
 * Complete state of a Theme Design.
 * Separates base layer (color-independent) from color schemes (palette/shadows only).
 */
export interface ThemeDesignState {
  // === Base Layer ===
  /** Currently selected base template */
  selectedTemplateId: ThemeTemplateRef;
  
  /** History of previously selected templates (for comparison feature) */
  templateHistory: string[];
  
  // === Base Modifications (Color-Independent) ===
  /** Base visual edits (typography, spacing, shape, breakpoints, component defaults, etc.) */
  baseVisualEdits: Record<string, SerializableValue>;
  
  // === Code Overrides (Global - Can Override Any Path) ===
  /** Raw code overrides source (can override palette, typography, anything) */
  codeOverridesSource: string;
  
  /** DSL representation of code overrides (safe JSON with placeholders) */
  codeOverridesDsl: ThemeDsl;
  
  /** Resolved code overrides (executable ThemeOptions, cached) */
  codeOverridesResolved: ThemeOptions;
  
  /** Flattened code overrides for quick lookups */
  codeOverridesFlattened: Record<string, SerializableValue>;
  
  /** Code override error, if any */
  codeOverridesError: string | null;
  
  // === Color-Scheme-Specific Modifications (Palette + Shadows Only) ===
  /** Light mode modifications (palette.*, shadows) */
  lightMode: ColorSchemeEdits;
  
  /** Dark mode modifications (palette.*, shadows) */
  darkMode: ColorSchemeEdits;
  
  // === UI State (Not Persisted) ===
  /** Currently active color scheme being edited */
  activeColorScheme: 'light' | 'dark';
  
  /** Currently selected preview component */
  activePreviewId: string;
  
  /** Dirty flag for unsaved changes */
  hasUnsavedChanges: boolean;

  // === Per-experience history (non-persistent) ===
  /** Visual edits history (past snapshots) */
  visualHistoryPast: Array<{
    baseVisualEdits: Record<string, SerializableValue>;
    light: Record<string, SerializableValue>;
    dark: Record<string, SerializableValue>;
  }>;

  /** Visual edits redo stack */
  visualHistoryFuture: Array<{
    baseVisualEdits: Record<string, SerializableValue>;
    light: Record<string, SerializableValue>;
    dark: Record<string, SerializableValue>;
  }>;

  /** Code edits history (past sources) */
  codeHistoryPast: string[];

  /** Code edits redo stack (future) */
  codeHistoryFuture: string[];
}

/**
 * Actions available on the Theme Design store.
 */
export interface ThemeDesignActions {
  // === Template Management ===
  /**
   * Switch to a different base template.
   * @param templateId - New template reference
   * @param keepEdits - If true, preserve existing modifications
   */
  switchTemplate: (templateId: ThemeTemplateRef, keepEdits: boolean) => void;
  
  // === Visual Edits ===
  /**
   * Set a visual edit at a specific path.
   * Routes to global or color-scheme-specific storage based on path.
   * @param path - Dot-notation path (e.g., 'palette.primary.main')
   * @param value - Serializable value
   */
  setVisualEdit: (path: string, value: SerializableValue) => void;
  
  /**
   * Remove a visual edit at a specific path.
   * @param path - Dot-notation path
   */
  removeVisualEdit: (path: string) => void;
  
  /**
   * Clear all visual edits for current color scheme or globally.
   * @param scope - 'global' | 'current-scheme' | 'all'
   */
  clearVisualEdits: (scope: 'global' | 'current-scheme' | 'all') => void;
  
  // === Code Overrides ===
  /**
   * Apply code overrides from Monaco editor.
   * Can override any path (palette, typography, spacing, etc.).
   * Evaluates source and stores result.
   * @param source - Raw JavaScript/TypeScript code
   */
  applyCodeOverrides: (source: string) => void;
  
  /**
   * Clear all code overrides.
   */
  clearCodeOverrides: () => void;
  
  // === Reset Actions ===
  /**
   * Reset a specific path to its base value.
   * Removes code override first (if exists), then visual edit.
   * @param path - Dot-notation path
   */
  resetPath: (path: string) => void;
  
  /**
   * Reset to visual edits only (clear all code overrides).
   */
  resetToVisual: () => void;
  
  /**
   * Reset to template base (clear all modifications).
   */
  resetToTemplate: () => void;
  
  // === UI State ===
  /**
   * Set the active color scheme being edited.
   * @param scheme - 'light' or 'dark'
   */
  setActiveColorScheme: (scheme: 'light' | 'dark') => void;
  
  /**
   * Select a preview component to display.
   * @param previewId - Preview component identifier
   */
  selectPreview: (previewId: string) => void;

  // === Scoped undo/redo (per-experience) ===
  /** Undo last visual edit (affects baseVisualEdits/lightMode/darkMode) */
  undoVisual: () => void;
  /** Redo last undone visual edit */
  redoVisual: () => void;
  /** Undo last code apply (restores previous codeOverridesSource) */
  undoCode: () => void;
  /** Redo last undone code apply */
  redoCode: () => void;
}

/**
 * Complete Theme Design store type (state + actions).
 */
export type ThemeDesignStore = ThemeDesignState & ThemeDesignActions;

/**
 * Configuration for resolving a complete theme from all layers.
 */
export interface ThemeResolutionConfig {
  /** Base template ThemeOptions (full theme for color scheme) */
  template: ThemeOptions;
  
  /** Base visual edits (typography, spacing, shape, component defaults) */
  baseVisualEdits: Record<string, SerializableValue>;
  
  /** Color-scheme-specific visual edits (palette.*, shadows) */
  colorSchemeVisualEdits: Record<string, SerializableValue>;
  
  /** Code overrides (global - can override any path including palette) */
  codeOverrides: ThemeOptions;
  
  /** Target color scheme */
  colorScheme: 'light' | 'dark';
}

/**
 * Result of evaluating code overrides.
 */
export interface CodeEvaluationResult {
  /** Successfully evaluated ThemeOptions */
  evaluated: ThemeOptions;
  
  /** Flattened version for quick path lookups */
  flattened: Record<string, SerializableValue>;
  
  /** Error message if evaluation failed */
  error: string | null;
}

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
  __type: 'spacing';
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
  __type: 'token';
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
  __type: 'breakpoint';
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction: 'up' | 'down' | 'only' | 'between';
  endBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // for 'between'
}

/**
 * DSL placeholder for MUI helper functions (alpha, lighten, darken, etc.).
 * 
 * @example
 * // User code: alpha('#fff', 0.5)
 * // DSL: { __type: 'helper', name: 'alpha', args: ['#fff', 0.5] }
 */
export interface DslHelperPlaceholder {
  __type: 'helper';
  name: 'alpha' | 'lighten' | 'darken' | 'emphasize' | 'getContrastRatio';
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
  __type: 'function';
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
  colorScheme: 'light' | 'dark';
  
  /** Base spacing factor (default: 8) */
  spacingFactor?: number;
}

