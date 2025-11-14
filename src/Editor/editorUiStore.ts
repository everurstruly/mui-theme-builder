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
