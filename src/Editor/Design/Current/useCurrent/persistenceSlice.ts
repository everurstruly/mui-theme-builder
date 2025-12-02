import type { StateCreator } from "zustand";
import type { CurrentDesignPersistenceSlice, CurrentDesignStore } from "./types";

export const createPersistenceSlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignPersistenceSlice
> = (set) => ({
  saveStatus: "idle",
  loadStatus: "idle",
  persistenceError: null,
  persistenceSnapshotId: null,
  lastPersistedAt: null,

  setSaveStatus: (status) => set({ saveStatus: status }),
  setLoadStatus: (status) => set({ loadStatus: status }),
  setPersistenceError: (error) => set({ persistenceError: error }),
  setPersistenceSnapshotId: (currentSnapshotId) => set({ persistenceSnapshotId: currentSnapshotId }),
  setPersistedAt: (lastSavedAt) => set({ lastPersistedAt: lastSavedAt }),
  reset: () =>
    set({
      saveStatus: "idle",
      loadStatus: "idle",
      persistenceError: null,
      persistenceSnapshotId: null,
      lastPersistedAt: null,
    }),
});
