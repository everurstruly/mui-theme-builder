import { create } from "zustand";
import { combine } from "zustand/middleware";

const presetZoomLevels = [30, 50, 70, 100, 120] as const;
export type PresetZoomLevels = (typeof presetZoomLevels)[number];
export type ViewAlignment = "center" | "start" | "pan";
export type AlignmentPositionsAdjustment = Exclude<ViewAlignment, "pan">;

const MIN_ZOOM = 20;
const MAX_ZOOM = 300;
const DEFAULT_ZOOM = 50;
const zoomDifference = 5;

const useZoomPanStore = create(
  combine(
    {
      zoom: DEFAULT_ZOOM,
      pan: { x: 0, y: 0 },
      alignment: "pan" as ViewAlignment,
    },

    (set, get) => ({
      /** Zoom in by +10% (up to MAX_ZOOM) */
      zoomIn: () => {
        set((state) => ({
          zoom: Math.min(state.zoom + zoomDifference, MAX_ZOOM),
        }));
      },

      /** Zoom out by -10% (down to MIN_ZOOM) */
      zoomOut: () => {
        set((state) => ({
          zoom: Math.max(state.zoom - zoomDifference, MIN_ZOOM),
        }));
      },

      /** Zoom by arbitrary percentage delta (for wheel or keyboard) */
      zoomBy: (amount: number) => {
        set((state) => ({
          zoom: Math.min(Math.max(state.zoom + amount, MIN_ZOOM), MAX_ZOOM),
        }));
      },

      /** Cycle through preset zoom levels (50%, 100%, 150%, 200%) */
      cycleZoomPreset: () => {
        const current = get().zoom;
        const index = presetZoomLevels.findIndex((lvl) => lvl === current);
        const nextIndex =
          index === -1 ? 0 : (index + 1) % presetZoomLevels.length;
        set({ zoom: presetZoomLevels[nextIndex] });
      },

      /** Manually set zoom value (clamped) */
      setZoom: (value: number) => {
        set({ zoom: Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM) });
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
          zoom: DEFAULT_ZOOM,
          pan: { x: 0, y: 0 },
          alignment: "start",
        });
      },

      alignTo: (mode: ViewAlignment) => {
        if (mode === "pan") return set({ alignment: "pan" });
        // reset pan to 0 when aligning start/center
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

export default useZoomPanStore;
