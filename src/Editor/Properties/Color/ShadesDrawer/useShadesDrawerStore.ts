import { create } from "zustand";
import type { PaletteGroupItemAttribute } from "../Color";

type State = {
  open: boolean;
  shades: PaletteGroupItemAttribute[];
  selectedPath: string | null;
  title?: string | null;
  openFor: (shades: PaletteGroupItemAttribute[], startPath?: string, title?: string) => void;
  close: () => void;
  setSelectedPath: (p: string | null) => void;
};

export const useShadesDrawerStore = create<State>((set) => ({
  open: false,
  shades: [],
  selectedPath: null,
  title: null,
  openFor: (shades: PaletteGroupItemAttribute[], startPath?: string, title?: string) =>
    set(() => ({
      shades,
      selectedPath: startPath ?? (shades.length > 0 ? shades[0].path : null),
      title: title ?? null,
      open: true,
    })),
  close: () => set(() => ({ open: false })),
  setSelectedPath: (p) => set(() => ({ selectedPath: p })),
}));

export type UseShadesDrawerState = State;
