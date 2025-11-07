import type { ThemeOptions } from '@mui/material/styles';

/**
 * Serializable primitive values that can be stored and transmitted.
 * Excludes functions, which must be stored as strings.
 */
export type SerializableValue =
  | string
  | number
  | boolean
  | null
  | SerializableValue[]
  | { [key: string]: SerializableValue };

/**
 * Reference to a base theme (e.g., 'default', 'ios', or custom imported)
 */
export type BaseThemeReference = {
  /** 'static' for built-in themes, 'imported' for user-provided */
  type: 'static' | 'imported';
  /** Identifier string (e.g., 'default', 'material-you') */
  ref: string;
};

/**
 * A composable is a reusable theme modification that can be toggled on/off.
 * Examples: "Dark Mode", "Dense Spacing", "Rounded Corners"
 */
export interface Composable {
  id: string;
  label: string;
  /** Either static ThemeOptions or a function that transforms the base theme */
  value: ThemeOptions | ((base: ThemeOptions) => ThemeOptions);
}

/**
 * TRANSIENT INPUT from Monaco or UI.
 * May contain:
 * - Literal values (string, number, boolean, null, arrays, objects)
 * - Function body strings (e.g., "t => t.palette.primary.main")
 */
export type RawThemeModification = SerializableValue | string;

/**
 * NORMALIZED PERSISTENT USER STATE.
 * Split into safe literals and opaque function strings.
 */
export interface ResolvedThemeModifications {
  /** Flat dot-notation paths to serializable values */
  literals: Record<string, SerializableValue>;
  /** Flat dot-notation paths to function body strings */
  functions: Record<string, string>;
}

/**
 * Contribution tracking for reset functionality.
 * Tracks which paths were contributed by which source (base, composables, user).
 */
export interface ContributionTracking {
  /** Paths contributed by the base theme */
  base: Set<string>;
  
  /** Paths contributed by each composable (composableId -> Set of paths) */
  composables: Map<string, Set<string>>;
  
  /** Paths contributed by direct user edits */
  user: Set<string>;
}

/**
 * Complete state of the ThemeWorkspace.
 * Only `resolvedThemeOptionsModifications`, `appliedBaseTheme`, `appliedComposables`,
 * and `contributions` are persisted and tracked in history.
 */
export interface ThemeWorkspaceState {
  /** METADATA: Currently applied base theme reference (not used in resolution) */
  appliedBaseTheme: BaseThemeReference;

  /** METADATA: Set of applied composable IDs (not used in resolution) */
  appliedComposables: Set<string>;

  /** PERSISTENT: All modifications (base + composables + user edits combined) */
  resolvedThemeOptionsModifications: ResolvedThemeModifications;

  /** METADATA: Tracks which source contributed which paths (for reset) */
  contributions: ContributionTracking;

  /** TRANSIENT: live editing buffer (not persisted, not history-tracked) */
  rawThemeOptionsModifications: Record<string, RawThemeModification>;

  /** Indicates if rawThemeOptionsModifications differs from resolved */
  isDirty: boolean;

  /** Currently selected preview component ID */
  activePreviewId: string;

  /** Active color scheme (light or dark) */
  colorScheme: 'light' | 'dark';
}

/**
 * Resolution mode for theme hydration.
 * - 'raw': strict evaluation, throws on errors (for committed/export)
 * - 'failsafe': safe evaluation with fallbacks (for live preview)
 */
export type ResolutionMode = 'raw' | 'failsafe';
