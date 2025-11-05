import { create } from "zustand";
import { combine } from "zustand/middleware";

export type EditorUiPanels =
  | "properties"
  | "explorer"
  | "properties.mobile"
  | "explorer.mobile";

const useEditorUiStore = create(
  combine(
    {
      hasSavedChanges: true,
      hiddenPanels: ["properties.mobile", "explorer.mobile"] as EditorUiPanels[],
    },

    (set) => ({
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
