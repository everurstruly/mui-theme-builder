import { create } from 'zustand';
import { useTemplates } from './useTemplates';

interface TemplateSelectionState {
  selectedId: string | null;
  select: (id: string) => void;
  clear: () => void;
  next: () => void;
  prev: () => void;
}

export const useTemplateSelection = create<TemplateSelectionState>((set, get) => ({
  selectedId: null,
  
  select: (id) => set({ selectedId: id }),
  
  clear: () => set({ selectedId: null }),
  
  /**
   * Select the next template in the list.
   * Cycles back to the beginning when reaching the end.
   * If nothing is selected, starts from the first template.
   */
  next: () => {
    const templates = useTemplates.getState().templates;
    if (templates.length === 0) return;
    
    const { selectedId } = get();
    
    // If no selection, start from beginning
    if (!selectedId) {
      set({ selectedId: templates[0].id });
      return;
    }
    
    // Find current index
    const currentIndex = templates.findIndex(t => t.id === selectedId);
    
    // If not found or at the end, loop to beginning
    if (currentIndex === -1 || currentIndex === templates.length - 1) {
      set({ selectedId: templates[0].id });
    } else {
      set({ selectedId: templates[currentIndex + 1].id });
    }
  },
  
  /**
   * Select the previous template in the list.
   * Cycles to the end when reaching the beginning.
   * If nothing is selected, starts from the last template.
   */
  prev: () => {
    const templates = useTemplates.getState().templates;
    if (templates.length === 0) return;
    
    const { selectedId } = get();
    
    // If no selection, start from end
    if (!selectedId) {
      set({ selectedId: templates[templates.length - 1].id });
      return;
    }
    
    // Find current index
    const currentIndex = templates.findIndex(t => t.id === selectedId);
    
    // If not found or at the beginning, loop to end
    if (currentIndex === -1 || currentIndex === 0) {
      set({ selectedId: templates[templates.length - 1].id });
    } else {
      set({ selectedId: templates[currentIndex - 1].id });
    }
  },
}));

export default useTemplateSelection;
