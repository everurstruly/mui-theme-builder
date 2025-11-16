import { create } from "zustand";
import { combine } from "zustand/middleware";

export type EditorUiPanels =
  | "library"
  | "properties"
  | "explorer"
  | "properties.mobile"
  | "explorer.mobile";

const useEditorUiStore = create(
  combine(
    {
      mouseOverCanvas: false,
      mouseOverPropertiesPanel: false,
      hasSavedChanges: true,
      hiddenPanels: [
        "library",
        "properties.mobile",
        "explorer",
        "explorer.mobile",
      ] as EditorUiPanels[],
      // Navigation state for folder browsing in the explorer (array of folder keys)
      activeFolder: [] as string[],
    },

    (set) => ({
      setMouseOverPropertiesPanel: (isMouseOver: boolean) => {
        set(() => ({
          mouseOverPropertiesPanel: isMouseOver,
        }));
      },

      setMouseOverCanvas: (isMouseOver: boolean) => {
        set(() => ({
          mouseOverCanvas: isMouseOver,
        }));
      },

      hidePanel: (panel: EditorUiPanels) => {
        set((state) => ({
          hiddenPanels: Array.from(new Set([...state.hiddenPanels, panel])),
        }));
      },

      hideAllPanels: () => {
        set(() => ({
          hiddenPanels: ["properties", "explorer"],
        }));
      },

      showAllPanels: () => {
        set(() => ({
          hiddenPanels: [],
        }));
      },

      showPanel: (panel: EditorUiPanels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },

      // Folder navigation helpers
      setActiveFolder: (chain: string[]) => {
        set(() => ({ activeFolder: chain }));
      },

      clearActiveFolder: () => {
        set(() => ({ activeFolder: [] }));
      },

      markUnsavedChanges: () => {
        set(() => ({
          hasSavedChanges: false,
        }));
      },

      saveChanges: () => {
        set(() => ({
          hasSavedChanges: true,
        }));
      },
    })
  )
);

export default useEditorUiStore;
