import { create } from "zustand";

type HelpTab = "getting-started" | "keyboard-shortcuts" | "misc";

interface HelpDialogState {
  opened: boolean;
  currentTab: HelpTab;
  setOpened: (opened: boolean) => void;
  setCurrentTab: (tab: HelpTab) => void;
  open: (tab?: HelpTab) => void;
  close: () => void;
}

export const useHelpDialog = create<HelpDialogState>((set) => ({
  opened: false,
  currentTab: "getting-started",
  setOpened: (opened) => set({ opened }),
  setCurrentTab: (currentTab) => set({ currentTab }),
  open: (tab) => set({ opened: true, currentTab: tab ?? "getting-started" }),
  close: () => set({ opened: false }),
}));
