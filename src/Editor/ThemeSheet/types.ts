import type { ThemeOptions } from '@mui/material/styles';

/**
 * Serializable primitive values that can be stored and transmitted.
 * Excludes functions, which must be stored as strings for persistence.
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * Reference to a base theme template (e.g., 'material', 'ios', or custom imported).
 */
export type ThemeTemplateRef = {
  /** 'static' for built-in templates, 'imported' for user-provided */
  type: 'static' | 'imported';
  /** Identifier string (e.g., 'material', 'ios') */
  id: string;
};

/**
 * A preset is a reusable theme modification that can be toggled on/off.
 * Examples: "Dark Mode", "Dense Spacing", "Rounded Corners"
 */
export interface ThemePreset {
  id: string;
  label: string;
  /** Either static ThemeOptions or a function that transforms the base theme */
  value: ThemeOptions | ((baseTheme: ThemeOptions) => ThemeOptions);
}

/**
 * Flat storage format for theme values using dot-notation paths.
 * Split into serializable literals and function body strings.
 * 
 * This is the PERSISTENT state format that gets saved and tracked in history.
 * 
 * @example
 * {
 *   literals: {
 *     "palette.primary.main": "#1976d2",
 *     "spacing": 8,
 *     "typography.fontSize": 14
 *   },
 *   functions: {
 *     "palette.primary.dark": "theme => theme.palette.primary.main"
 *   }
 * }
 */
export interface FlatThemeOptions {
  /** Flat dot-notation paths to serializable values */
  literals: Record<string, SerializableValue>;
  /** Flat dot-notation paths to function body strings */
  functions: Record<string, string>;
}

/**
 * Editor buffer for live preview before committing.
 * May contain literal values or function body strings.
 * 
 * This is TRANSIENT state (not persisted, not tracked in history).
 */
export type ThemeEditBuffer = Record<string, SerializableValue | string>;

/**
 * Complete state of the ThemeSheet store.
 * Only certain properties are persisted and tracked in history.
 */
export interface ThemeSheetState {
  /** Currently selected base theme template */
  selectedThemeTemplateId: ThemeTemplateRef;

  /** Enabled state of appearance presets */
  enabledPresets: Record<string, boolean>;

  /** PERSISTENT: Committed user edits in flat format (history-tracked) */
  flatThemeOptions: FlatThemeOptions;

  /** TRANSIENT: Live editing buffer (not persisted, not history-tracked) */
  editBuffer: ThemeEditBuffer;

  /** Indicates if editBuffer differs from flatThemeOptions */
  hasUnsavedEdits: boolean;

  /** Currently selected preview component ID for the canvas */
  activePreviewId: string;

  /** Active color scheme (light or dark) */
  colorScheme: 'light' | 'dark';
}

/**
 * Resolution mode for theme hydration.
 * - 'strict': strict evaluation, throws on errors (for export/committed state)
 * - 'safe': safe evaluation with fallbacks (for live preview)
 */
export type ThemeResolutionMode = 'strict' | 'safe';

