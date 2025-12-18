import { create } from "zustand";

interface FontFamilyDrawerState {
  open: boolean;
  title: string;
  currentValue: string;
  path: string;
  onSelect: ((fontFamily: string) => void) | null;
  onReset: (() => void) | null;
  
  openDrawer: (params: {
    title: string;
    currentValue: string;
    path: string;
    onSelect: (fontFamily: string) => void;
    onReset: () => void;
  }) => void;
  close: () => void;
}

export const useFontFamilyDrawerStore = create<FontFamilyDrawerState>((set) => ({
  open: false,
  title: "",
  currentValue: "",
  path: "",
  onSelect: null,
  onReset: null,
  
  openDrawer: ({ title, currentValue, path, onSelect, onReset }) =>
    set({
      open: true,
      title,
      currentValue,
      path,
      onSelect,
      onReset,
    }),
  
  close: () =>
    set({
      open: false,
      title: "",
      currentValue: "",
      path: "",
      onSelect: null,
      onReset: null,
    }),
}));
