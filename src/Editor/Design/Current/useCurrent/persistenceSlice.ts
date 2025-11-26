/**
 * Persistence Slice - Storage Status Management
 *
 * Responsibilities:
 * - Track persistence/save status
 * - Manage loading/error states for storage operations
 *
 * Does NOT contain:
 * - Domain state
 * - UI state
 * - History
 * - Actual persistence logic (that belongs in a service)
 */

import type { StateCreator } from "zustand";

// ===== Types =====

export type PersistenceStatus = "idle" | "loading" | "success" | "error";

/**
 * Persistence state.
 */
export interface ThemeDesignPersistenceState {
  /** Current persistence status */
  status: PersistenceStatus;

  /** Error message if status is 'error' */
  error: string | null;

  /** Last successful save timestamp */
  lastSaved: number | null;
}

/**
 * Persistence actions.
 */
export interface ThemeDesignPersistenceActions {
  /** Set persistence status */
  setStatus: (status: PersistenceStatus, error?: string) => void;

  /** Mark as successfully saved */
  recordLastSaved: () => void;

  /** Reset persistence state */
  resetPersistence: () => void;
}

export type ThemeDesignPersistenceSlice = ThemeDesignPersistenceState &
  ThemeDesignPersistenceActions;

// ===== Slice Creator =====

export const createPersistenceSlice: StateCreator<
  ThemeDesignPersistenceSlice,
  [],
  [],
  ThemeDesignPersistenceSlice
> = (set) => ({
  // Initial state
  status: "idle",
  error: null,
  lastSaved: null,

  // Actions
  setStatus: (status, error) => {
    set({ status, error: error || null });
  },

  recordLastSaved: () => {
    set({
      status: "success",
      error: null,
      lastSaved: Date.now(),
    });
  },

  resetPersistence: () => {
    set({
      status: "idle",
      error: null,
      lastSaved: null,
    });
  },
});
