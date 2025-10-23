import { create } from "zustand";
import { combine } from "zustand/middleware";

export const presetZoomLevels = [30, 50, 70, 100, 120] as const;

export type PresetZoomLevels = (typeof presetZoomLevels)[number];
export type ViewAlignment = "center" | "start" | "pan";
export type ViewAlignmentAdjustment = Exclude<ViewAlignment, "pan">;

export const minZoomLevel = 20;
export const maxZoomLevel = 300;
export const defaultZoomValue = 50;
export const zoomCountDifference = 10;

const useCanvasZoomPanSurfaceStore = create(
  combine(
    {
      zoom: defaultZoomValue,
      pan: { x: 0, y: 0 },
      alignment: "pan" as ViewAlignment,
    },

    (set, get) => ({
      zoomIn: () => {
        set((state) => ({
          zoom: Math.min(state.zoom + zoomCountDifference, maxZoomLevel),
        }));
      },

      zoomOut: () => {
        set((state) => ({
          zoom: Math.max(state.zoom - zoomCountDifference, minZoomLevel),
        }));
      },

      zoomBy: (amount: number) => {
        set((state) => ({
          zoom: Math.min(
            Math.max(state.zoom + amount, minZoomLevel),
            maxZoomLevel
          ),
        }));
      },

      cycleZoomPreset: () => {
        const current = get().zoom;
        const index = presetZoomLevels.findIndex((lvl) => lvl === current);
        const nextIndex =
          index === -1 ? 0 : (index + 1) % presetZoomLevels.length;
        set({ zoom: presetZoomLevels[nextIndex] });
      },

      /** Manually set zoom value (clamped) */
      setZoom: (value: number) => {
        set({ zoom: Math.min(Math.max(value, minZoomLevel), maxZoomLevel) });
      },

      /** Absolute pan position */
      setPan: (x: number, y: number) => {
        set({ pan: { x, y }, alignment: "pan" });
      },

      /** Relative pan by delta */
      panBy: (dx: number, dy: number) => {
        const { pan } = get();
        set({
          alignment: "pan",
          pan: {
            x: pan.x + dx,
            y: pan.y + dy,
          },
        });
      },

      /** Reset only pan position */
      resetPan: () => {
        set({ pan: { x: 0, y: 0 }, alignment: "start" });
      },

      /** Reset both zoom and pan to defaults */
      resetView: () => {
        set({
          zoom: defaultZoomValue,
          pan: { x: 0, y: 0 },
          alignment: "start",
        });
      },

      alignTo: (mode: ViewAlignmentAdjustment) => {
        set({ alignment: mode, pan: { x: 0, y: 0 } });
      },

      toggleAlignment: () => {
        set((state) => {
          const order: ViewAlignment[] = ["pan", "center", "start"];
          const next =
            order[(order.indexOf(state.alignment) + 1) % order.length];

          return {
            alignment: next,
            pan: next === "pan" ? state.pan : { x: 0, y: 0 },
          };
        });
      },
    })
  )
);

export default useCanvasZoomPanSurfaceStore;
