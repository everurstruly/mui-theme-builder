import { create } from "zustand";
import { combine } from "zustand/middleware";

const sidebarPanels = [
  "properties",
  "explorer",
  "properties.mobile",
  "explorer.mobile",
];

const panels = ["library", ...sidebarPanels];

export const designProperties = [
  { label: "Color", value: "palette" },
  { label: "Font", value: "typography" },
  { label: "Sizes", value: "appearance" },
  { label: "Effects", value: "effects" },
] as const;

export type PropertyTab = (typeof designProperties)[number]["value"];
export type EditorPanels = (typeof panels)[number];
export type EditorExperience = "designer" | "developer";

export const useEditorStore = create(
  combine(
    {
      mouseOverCanvas: false,
      mouseOverPropertiesPanel: false,
      selectedExperience: "designer" as EditorExperience,
      selectedPropertyTab: "palette" as PropertyTab,
      sidebarPanelsBeforeHide: [] as EditorPanels[],
      hiddenPanels: [
        "library",
        "properties.mobile",
        "explorer",
        "explorer.mobile",
      ] as EditorPanels[],
    },

    (set, get) => ({
      selectExperience: (experience: EditorExperience) => {
        set({ selectedExperience: experience });
      },

      selectPropertyTab: (tab: PropertyTab) => {
        set(() => ({
          selectedPropertyTab: tab,
        }));
      },

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

      hidePanel: (panel: EditorPanels) => {
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

      showPanel: (panel: EditorPanels) => {
        set((state) => ({
          hiddenPanels: state.hiddenPanels.filter((p) => p !== panel),
        }));
      },
    })
  )
);

export default useEditorStore;
