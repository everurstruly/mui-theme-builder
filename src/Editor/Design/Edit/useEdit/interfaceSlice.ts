/**
 * UI Slice - Editor Interface State
 *
 * Responsibilities:
 * - Track active color scheme being edited
 * - Track selected preview component
 * - Track selected experience/tab
 *
 * Does NOT contain:
 * - Theme domain state
 * - History/undo/redo
 * - Storage status (separate concern)
 */

import type { StateCreator } from "zustand";
import type { EditorDesignExperienceId } from "../../../editorExperience";

// ===== Types =====

/**
 * UI state for the theme editor.
 */
export interface ThemeDesignInterfaceState {
  /** Currently active color scheme being edited */
  activeColorScheme: "light" | "dark";

  /** Currently selected preview component */
  activePreviewId: string;

  /** Currently selected experience/tab */
  selectedExperienceId: EditorDesignExperienceId;
}

/**
 * UI actions for the theme editor.
 */
export interface ThemeDesignInterfaceActions {
  /** Switch active color scheme */
  setActiveColorScheme: (scheme: "light" | "dark") => void;

  /** Select a preview component */
  selectPreview: (previewId: string) => void;

  /** Select an experience/tab */
  selectExperience: (experienceId: EditorDesignExperienceId) => void;
}

export type DesignEditInterfaceSlice = ThemeDesignInterfaceState &
  ThemeDesignInterfaceActions;

// ===== Slice Creator =====

export const createInterfaceSlice: StateCreator<
  DesignEditInterfaceSlice,
  [],
  [],
  DesignEditInterfaceSlice
> = (set) => ({
  // Initial state
  activeColorScheme: "light",
  activePreviewId: "DevSandbox",
  selectedExperienceId: "primitives",

  // Actions
  setActiveColorScheme: (scheme) => {
    set({ activeColorScheme: scheme });
  },

  selectPreview: (previewId) => {
    set({ activePreviewId: previewId });
  },

  selectExperience: (experienceId) => {
    set({ selectedExperienceId: experienceId });
  },
});
