import type { StateCreator } from "zustand";
import type { CurrentDesignPreviewSlice } from "./types";
import type { CurrentDesignStore } from ".";

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
