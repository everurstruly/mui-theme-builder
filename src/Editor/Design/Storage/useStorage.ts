import { create } from "zustand";

export type StorageStatus = "idle" | "loading" | "success" | "error";

export interface UseStorageState {
  storageProgress: StorageStatus;
  storageProgressError: string | null;
  lastSavedTimestamp: number | null;

  // The id of the last saved item (if any). Used to verify that the
  // current editor content corresponds to the stored item.
  lastSavedId?: string | null;

  // Actions
  setStatus: (status: StorageStatus, error?: string) => void;
  recordLastStored: (id?: string | null) => void;
  setLastSavedId: (id?: string | null) => void;
  resetStorage: () => void;
}

export const useStorage = create<UseStorageState>((set: (partial: Partial<UseStorageState>) => void) => ({
  storageProgress: "idle",
  storageProgressError: null,
  lastSavedTimestamp: null,

  setStatus: (status: StorageStatus, error?: string) => {
    set({ storageProgress: status, storageProgressError: error || null });
  },

  recordLastStored: (id?: string | null) => {
    set({ storageProgress: "success", storageProgressError: null, lastSavedTimestamp: Date.now(), lastSavedId: id ?? null });
  },

  setLastSavedId: (id?: string | null) => {
    set({ lastSavedId: id ?? null });
  },

  resetStorage: () => {
    set({ storageProgress: "idle", storageProgressError: null, lastSavedTimestamp: null });
  },
}));

export default useStorage;

