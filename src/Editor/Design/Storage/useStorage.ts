import { create } from "zustand";

export type StorageStatus = "idle" | "loading" | "success" | "error";

export interface UseStorageState {
  storageProgress: StorageStatus;
  storageProgressError: string | null;
  lastSavedTimestamp: number | null;

  // Actions
  setStatus: (status: StorageStatus, error?: string) => void;
  recordLastStored: () => void;
  resetStorage: () => void;
}

export const useStorage = create<UseStorageState>((set: (partial: Partial<UseStorageState>) => void) => ({
  storageProgress: "idle",
  storageProgressError: null,
  lastSavedTimestamp: null,

  setStatus: (status: StorageStatus, error?: string) => {
    set({ storageProgress: status, storageProgressError: error || null });
  },

  recordLastStored: () => {
    set({ storageProgress: "success", storageProgressError: null, lastSavedTimestamp: Date.now() });
  },

  resetStorage: () => {
    set({ storageProgress: "idle", storageProgressError: null, lastSavedTimestamp: null });
  },
}));

export default useStorage;

