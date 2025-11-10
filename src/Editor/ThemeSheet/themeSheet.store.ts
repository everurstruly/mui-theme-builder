import { create } from 'zustand';
import { temporal } from 'zundo';
import type {
  ThemeSheetState,
  ThemeEditBuffer,
  SerializableValue,
  ThemeTemplateRef,
} from './types';
import { expandFlatThemeOptions, flattenThemeOptions, splitThemeOptions } from './themeSheet.utils';


/**
 * Actions available on the ThemeSheet store.
 * All actions use clear, descriptive naming.
 */
interface ThemeSheetActions {
  /**
   * Updates the live edit buffer (transient state for preview).
   * Does not trigger history. Sets hasUnsavedEdits to true.
   */
  setEditBuffer: (buffer: ThemeEditBuffer) => void;

  /**
   * Sets a single value in the edit buffer at a specific path.
   * Does not trigger history. Sets hasUnsavedEdits to true.
   */
  setEditValue: (path: string, value: SerializableValue | string) => void;

  /**
   * Removes a value from the edit buffer at a specific path.
   * Does not trigger history. Sets hasUnsavedEdits to true.
   */
  removeEditValue: (path: string) => void;

  /**
   * Commits edit buffer to persistent flat storage.
   * Triggers history tracking. Resets hasUnsavedEdits to false.
   */
  commitEdits: () => void;

  /**
   * Discards uncommitted changes in edit buffer.
   * Resets edit buffer to match current flat storage.
   */
  discardEdits: () => void;

  /**
   * Clears all user edits (resets to template defaults).
   * Triggers history tracking.
   */
  clearAllEdits: () => void;

  /**
   * Selects a theme template to use as the base.
   * Triggers history tracking.
   */
  selectThemeTemplate: (templateRef: ThemeTemplateRef) => void;

  /**
   * Toggles a theme preset on/off.
   * Triggers history tracking.
   */
  togglePreset: (presetId: string, enabled: boolean) => void;

  /**
   * Selects the active preview component to display in the canvas.
   * Does not trigger history.
   */
  selectPreview: (previewId: string) => void;

  /**
   * Sets the active color scheme (light or dark).
   * Triggers history tracking.
   */
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

/**
 * Complete ThemeSheet store type (state + actions)
 */
type ThemeSheetStore = ThemeSheetState & ThemeSheetActions;

/**
 * Creates the ThemeSheet Zustand store with temporal (undo/redo) support.
 * 
 * Key features:
 * - Flat storage for persistent theme edits
 * - Live edit buffer for transient changes (not history-tracked)
 * - Undo/redo support via zundo's temporal middleware
 * - Clear separation of concerns (persistent vs transient state)
 */
export const useThemeSheetStore = create<ThemeSheetStore>()(
  temporal(
    (set, get) => ({
      // ===== Initial State =====
      selectedThemeTemplateId: { type: 'static', id: 'material' },
      enabledPresets: {},
      flatThemeOptions: { literals: {}, functions: {} },
      editBuffer: {},
      hasUnsavedEdits: false,
      activePreviewId: 'DashboardExample',
      colorScheme: 'light',

      // ===== Actions =====

      setEditBuffer: (buffer) => {
        set({ editBuffer: buffer, hasUnsavedEdits: true });
      },

      setEditValue: (path, value) => {
        const currentBuffer = get().editBuffer;
        set({
          editBuffer: { ...currentBuffer, [path]: value },
          hasUnsavedEdits: true,
        });
      },

      removeEditValue: (path) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [path]: _, ...restBuffer } = get().editBuffer;
        set({
          editBuffer: restBuffer,
          hasUnsavedEdits: true,
        });
      },

      commitEdits: () => {
        const buffer = get().editBuffer;

        // Convert flat edit buffer to nested structure
        const nestedEdits = expandFlatThemeOptions(buffer);

        // Split into literals and functions
        const flatThemeOptions = splitThemeOptions(nestedEdits);

        set({
          flatThemeOptions,
          hasUnsavedEdits: false,
        });
      },

      discardEdits: () => {
        const { literals, functions } = get().flatThemeOptions;

        // Reconstruct the committed flat state
        const committedNested = expandFlatThemeOptions(literals);
        const committedFlat = {
          ...flattenThemeOptions(committedNested),
          ...functions,
        };

        set({
          editBuffer: committedFlat,
          hasUnsavedEdits: false,
        });
      },

      clearAllEdits: () => {
        set({
          flatThemeOptions: { literals: {}, functions: {} },
          editBuffer: {},
          hasUnsavedEdits: false,
        });
      },

      selectThemeTemplate: (templateRef) => {
        set({ selectedThemeTemplateId: templateRef });
      },

      togglePreset: (presetId, enabled) => {
        set((state) => ({
          enabledPresets: {
            ...state.enabledPresets,
            [presetId]: enabled,
          },
        }));
      },

      selectPreview: (previewId) => {
        set({ activePreviewId: previewId });
      },

      setColorScheme: (scheme) => {
        set({ colorScheme: scheme });
      },
    }),
    {
      // Only track persistent state in history (exclude transient edit buffer)
      partialize: (state) => ({
        selectedThemeTemplateId: state.selectedThemeTemplateId,
        enabledPresets: state.enabledPresets,
        flatThemeOptions: state.flatThemeOptions,
        activePreviewId: state.activePreviewId,
        colorScheme: state.colorScheme,
      }),
      limit: 20, // Keep last 20 committed states
      equality: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    }
  )
);

