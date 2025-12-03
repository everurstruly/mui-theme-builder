import { create } from "zustand";

export type LaunchDialog = "template" | "blank" | "link" | "paste";

interface LaunchDialogStore {
  screen: LaunchDialog;
  anchorEl: HTMLElement | null;
  setScreen: (screen: LaunchDialog) => void;
  open: (anchorEl: HTMLElement) => void;
  close: () => void;
}

export const useLaunchDialog = create<LaunchDialogStore>((set) => ({
  screen: "template",
  anchorEl: null,
  setScreen: (screen) => set({ screen }),
  open: (anchorEl) => set({ anchorEl }),
  close: () => set({ anchorEl: null }),
}));
