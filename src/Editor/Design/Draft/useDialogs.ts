import { create } from "zustand";
import type { LoadBlocker } from "../Current/useCurrent/types";

type LoadStatus = "idle" | "loading" | "blocked";

export type StrategiesDialog = "template" | "blank" | "link" | "paste";

type DialogsState = {
  loadStatus: LoadStatus;
  setLoadStatus: (s: LoadStatus) => void;
  loadBlocker: LoadBlocker | null;
  setLoadBlocker: (b: LoadBlocker | null) => void;
  clearLoadBlocker: () => void;

  // Launch dialog state (merged from useLaunchDialog)
  launchScreen: StrategiesDialog;
  launchIsOpen: boolean;
  setLaunchScreen: (s: StrategiesDialog) => void;
  openLaunch: () => void;
  closeLaunch: () => void;
};

const useDialogs = create<DialogsState>((set) => ({
  loadStatus: "idle",
  setLoadStatus: (loadStatus) => set({ loadStatus }),
  loadBlocker: null,
  setLoadBlocker: (loadBlocker) => set({ loadBlocker }),
  clearLoadBlocker: () => set({ loadBlocker: null }),

  // Launch dialog defaults
  launchScreen: "template",
  launchIsOpen: false,
  setLaunchScreen: (launchScreen) => set({ launchScreen }),
  openLaunch: () => set({ launchIsOpen: true }),
  closeLaunch: () => set({ launchIsOpen: false }),
}));

export default useDialogs;
