import { create } from "zustand";
import { combine } from "zustand/middleware";

const sidebarPanels = [
  "properties",
  "explorer",
  "properties.mobile",
  "explorer.mobile",
];
const panels = ["library", ...sidebarPanels];
export type EditorUiPanels = (typeof panels)[number];

export const useEditorUiStore = create(
  combine(
    {
      mouseOverCanvas: false,
      mouseOverPropertiesPanel: false,
      hasSavedChanges: true,
      sidebarPanelsBeforeHide: [] as EditorUiPanels[],
      hiddenPanels: [
        "library",
        "properties.mobile",
        "explorer",
        "explorer.mobile",
      ] as EditorUiPanels[],
    },

    (set, get) => ({
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

      hideCanvasSidebarPanels: () => {
        set(() => ({
          sidebarPanelsBeforeHide: get().hiddenPanels,
          hiddenPanels: [
            "properties",
            "properties.mobile",
            "explorer",
            "explorer.mobile",
          ],
        }));
      },

      restoreCanvasSidebarPanels: () => {
        set(() => ({
          hiddenPanels: get().sidebarPanelsBeforeHide,
          sidebarPanelsBeforeHide: [],
        }));
      },

      hideAllPanels: () => {
        set(() => ({
          hiddenPanels: [...panels],
        }));
      },

      showAllPanels: () => {
        set(() => ({
          hiddenPanels: [...panels],
        }));
      },

      showPanel: (panel: EditorUiPanels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },
    })
  )
);

export default useEditorUiStore;
