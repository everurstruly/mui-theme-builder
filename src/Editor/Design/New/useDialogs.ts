import { create } from "zustand";
import type { LoadBlocker } from "../Current/useCurrent/types";

type LoadStatus = "idle" | "loading" | "blocked";

type DialogsState = {
  loadStatus: LoadStatus;
  setLoadStatus: (s: LoadStatus) => void;
  loadBlocker: LoadBlocker | null;
  setLoadBlocker: (b: LoadBlocker | null) => void;
  clearLoadBlocker: () => void;
};

const useDialogs = create<DialogsState>((set) => ({
  loadStatus: "idle",
  setLoadStatus: (loadStatus) => set({ loadStatus }),
  loadBlocker: null,
  setLoadBlocker: (loadBlocker) => set({ loadBlocker }),
  clearLoadBlocker: () => set({ loadBlocker: null }),
}));

export default useDialogs;
