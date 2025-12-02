import type { StateCreator } from "zustand";
import type { CurrentDesignPreviewSlice, CurrentDesignStore } from "./types";

export const createPreviewSlice: StateCreator<
  CurrentDesignStore,
  [],
  [],
  CurrentDesignPreviewSlice
> = (set) => ({
  activeColorScheme: "light",
  activePreviewId: "DevSandbox",

  setActiveColorScheme: (scheme) => {
    set({ activeColorScheme: scheme });
  },

  selectPreview: (previewId) => {
    set({ activePreviewId: previewId });
  },
});
