import { create } from "zustand";
import { combine } from "zustand/middleware";

const presetZoomLevels = [50, 100, 150, 200] as const;
export type PresetZoomLevels = (typeof presetZoomLevels)[number];

const MIN_ZOOM = 20;
const MAX_ZOOM = 300;
const DEFAULT_ZOOM = 100;

const useZoomPanStore = create(
  combine(
    {
      zoom: DEFAULT_ZOOM,
      pan: { x: 0, y: 0 },
    },

    (set, get) => ({
      /** Zoom in by +10% (up to MAX_ZOOM) */
      zoomIn: () => {
        set((state) => ({
          zoom: Math.min(state.zoom + 10, MAX_ZOOM),
        }));
      },

      /** Zoom out by -10% (down to MIN_ZOOM) */
      zoomOut: () => {
        set((state) => ({
          zoom: Math.max(state.zoom - 10, MIN_ZOOM),
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
        set({ pan: { x, y } });
      },

      /** Relative pan by delta */
      panBy: (dx: number, dy: number) => {
        const { pan } = get();
        set({
          pan: {
            x: pan.x + dx,
            y: pan.y + dy,
          },
        });
      },

      /** Reset only pan position */
      resetPan: () => {
        set({ pan: { x: 0, y: 0 } });
      },

      /** Reset both zoom and pan to defaults */
      resetView: () => {
        set({ zoom: DEFAULT_ZOOM, pan: { x: 0, y: 0 } });
      },
    })
  )
);

export default useZoomPanStore;
