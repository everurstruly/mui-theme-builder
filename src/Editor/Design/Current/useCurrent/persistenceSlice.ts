import type { StateCreator } from "zustand";
import type { CurrentDesignPersistenceSlice, CurrentDesignStore } from "./types";

export const createPersistenceSlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignPersistenceSlice
> = (set) => ({
  saveStatus: "idle",
  creationStatus: "idle",
  saveError: null,
  savedId: null,
  lastSavedAt: null,

  updateSaveStatus: (status) => set({ saveStatus: status }),
  updateCreationStatus: (status) => set({ creationStatus: status }),
  recordSaveError: (error) => set({ saveError: error }),
  assignSaveId: (savedDesignId) => set({ savedId: savedDesignId }),
  recordSavedAt: (lastSavedAt) => set({ lastSavedAt: lastSavedAt }),
  reset: () =>
    set({
      saveStatus: "idle",
      creationStatus: "idle",
      saveError: null,
      savedId: null,
      lastSavedAt: null,
    }),
});
