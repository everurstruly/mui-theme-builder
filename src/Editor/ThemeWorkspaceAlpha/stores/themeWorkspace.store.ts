import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  ThemeWorkspaceState,
  RawThemeModification,
  BaseThemeReference,
} from '../types';
import { expandFlatThemeOptions } from '../utils/expandFlatThemeOptions';
import { flattenThemeOptions } from '../utils/flattenThemeOptions';
import { splitThemeOptions } from '../utils/splitThemeOptions';

/**
 * Actions available on the ThemeWorkspace store
 */
interface ThemeWorkspaceActions {
  /**
   * Update the transient raw modifications buffer (from UI or Monaco).
   * Does not trigger history. Sets isDirty to true.
   */
  setRawModifications: (mods: Record<string, RawThemeModification>) => void;

  /**
   * Commits raw modifications to resolved state.
   * Triggers history tracking. Resets isDirty to false.
   */
  commitRawModifications: () => void;

  /**
   * Discards uncommitted changes in raw buffer.
   * Resets raw buffer to match current resolved state.
   */
  discardChanges: () => void;

  /**
   * Sets the active base theme reference.
   */
  setActiveBaseTheme: (baseTheme: BaseThemeReference) => void;

  /**
   * Toggles a composable on/off.
   */
  toggleComposable: (id: string, enabled: boolean) => void;

  /**
   * Sets a single raw modification at a specific path.
   */
  setRawModificationAtPath: (path: string, value: RawThemeModification) => void;

  /**
   * Removes a modification at a specific path (reset to base).
   */
  removeModificationAtPath: (path: string) => void;

  /**
   * Selects the active preview component to display in the canvas.
   */
  selectPreview: (id: string) => void;

  /**
   * Sets the active color scheme (light or dark).
   */
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

type ThemeWorkspaceStore = ThemeWorkspaceState & ThemeWorkspaceActions;

/**
 * Creates the ThemeWorkspace Zustand store with temporal (undo/redo) support.
 */
export const useThemeWorkspaceStore = create<ThemeWorkspaceStore>()(
  temporal(
    (set, get) => ({
      // ===== Initial State =====
      activeBaseThemeOption: { type: 'static', ref: 'default' },
      appearanceComposablesState: {},
      resolvedThemeOptionsModifications: { literals: {}, functions: {} },
      rawThemeOptionsModifications: {},
      isDirty: false,
      activePreviewId: 'DashboardExample', // Default preview
      colorScheme: 'light', // Default color scheme

      // ===== Actions =====

      setRawModifications: (mods) => {
        set({ rawThemeOptionsModifications: mods, isDirty: true });
      },

      setRawModificationAtPath: (path, value) => {
        const current = get().rawThemeOptionsModifications;
        set({
          rawThemeOptionsModifications: { ...current, [path]: value },
          isDirty: true,
        });
      },

      removeModificationAtPath: (path) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [path]: _, ...rest } = get().rawThemeOptionsModifications;
        set({
          rawThemeOptionsModifications: rest,
          isDirty: true,
        });
      },

      commitRawModifications: () => {
        const raw = get().rawThemeOptionsModifications;

        // Convert flat raw modifications to structured object
        const reconstructed = expandFlatThemeOptions(raw);

        // Split into literals and functions
        const resolved = splitThemeOptions(reconstructed);

        set({
          resolvedThemeOptionsModifications: resolved,
          isDirty: false,
        });
      },

      discardChanges: () => {
        const state = get();
        const { literals, functions } = state.resolvedThemeOptionsModifications;

        // Reconstruct the committed state
        const committedStructured = expandFlatThemeOptions(literals);
        const committedFlat = {
          ...flattenThemeOptions(committedStructured),
          ...functions,
        };

        set({
          rawThemeOptionsModifications: committedFlat,
          isDirty: false,
        });
      },

      setActiveBaseTheme: (baseTheme) => {
        set({ activeBaseThemeOption: baseTheme });
      },

      toggleComposable: (id, enabled) => {
        set((state) => ({
          appearanceComposablesState: {
            ...state.appearanceComposablesState,
            [id]: { enabled },
          },
        }));
      },

      selectPreview: (id) => {
        set({ activePreviewId: id });
      },

      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
      },
    }),
    {
      // Only track persistent state in history (exclude transient raw buffer)
      partialize: (state) => ({
        activeBaseThemeOption: state.activeBaseThemeOption,
        appearanceComposablesState: state.appearanceComposablesState,
        resolvedThemeOptionsModifications: state.resolvedThemeOptionsModifications,
        activePreviewId: state.activePreviewId,
        colorScheme: state.colorScheme,
      }),
      limit: 20, // Keep last 20 committed states (reasonable for theme modifications)
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);
