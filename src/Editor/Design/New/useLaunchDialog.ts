import { create } from "zustand";

export type LaunchDialog = "template" | "blank" | "link" | "paste";

interface LaunchDialogStore {
  screen: LaunchDialog;
  isOpen: boolean;
  setScreen: (screen: LaunchDialog) => void;
  open: () => void;
  close: () => void;
}

export const useLaunchDialog = create<LaunchDialogStore>((set) => ({
  screen: "template",
  isOpen: false,
  setScreen: (screen) => set({ screen }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
