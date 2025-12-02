import { create } from 'zustand';

export type LaunchScreen = 'template' | 'blank' | 'link' | 'paste';

interface LaunchScreenState {
  screen: LaunchScreen;
  anchorEl: HTMLElement | null;
  setScreen: (screen: LaunchScreen) => void;
  open: (anchorEl: HTMLElement) => void;
  close: () => void;
}

export const useLaunchScreen = create<LaunchScreenState>((set) => ({
  screen: 'template',
  anchorEl: null,
  setScreen: (screen) => set({ screen }),
  open: (anchorEl) => set({ anchorEl }),
  close: () => set({ anchorEl: null }),
}));
