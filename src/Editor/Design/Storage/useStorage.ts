import { create } from "zustand";

export type StorageStatus = "idle" | "loading" | "success" | "error";

export interface UseStorageState {
  storageProgress: StorageStatus;
  storageProgressError: string | null;
  lastSavedTimestamp: number | null;

  // Optional delegate for performing a save; set by the collection module.
  save?: (opts?: { title?: string; includeSession?: boolean }) => Promise<string | void>;

  // Actions
  setStatus: (status: StorageStatus, error?: string) => void;
  recordLastStored: () => void;
  resetStorage: () => void;

  // Used by the collection to register the actual save implementation.
  setSaveDelegate: (
    fn?: (opts?: { title?: string; includeSession?: boolean }) => Promise<string | void>
  ) => void;
}

const useStorage = create<UseStorageState>((set: (partial: Partial<UseStorageState>) => void) => ({
  storageProgress: "idle",
  storageProgressError: null,
  lastSavedTimestamp: null,

  save: undefined,

  setStatus: (status: StorageStatus, error?: string) => {
    set({ storageProgress: status, storageProgressError: error || null });
  },

  recordLastStored: () => {
    set({ storageProgress: "success", storageProgressError: null, lastSavedTimestamp: Date.now() });
  },

  resetStorage: () => {
    set({ storageProgress: "idle", storageProgressError: null, lastSavedTimestamp: null });
  },

  setSaveDelegate: (
    fn?: (opts?: { title?: string; includeSession?: boolean }) => Promise<string | void>
  ) => {
    set({ save: fn });
  },
}));

export default useStorage;

