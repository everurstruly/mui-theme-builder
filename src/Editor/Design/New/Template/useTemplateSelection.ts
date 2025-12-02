import { create } from 'zustand';

interface TemplateSelectionState {
  selectedId: string | null;
  select: (id: string) => void;
  clear: () => void;
}

export const useTemplateSelection = create<TemplateSelectionState>((set) => ({
  selectedId: null,
  select: (id) => set({ selectedId: id }),
  clear: () => set({ selectedId: null }),
}));
