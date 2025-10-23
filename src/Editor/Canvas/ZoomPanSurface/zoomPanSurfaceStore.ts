import { create } from "zustand";
import { combine } from "zustand/middleware";
import { clampZoom, getNextZoomPreset, getNextAlignment } from "./zoomPanLogic";

export const presetZoomLevels = [20, 50, 100, 150] as const;

export type PresetZoomLevels = (typeof presetZoomLevels)[number];
export type ViewAlignment = "center" | "start" | "pan";
export type ViewAlignmentAdjustment = Exclude<ViewAlignment, "pan">;

export const minZoomLevel = 15;
export const maxZoomLevel = 300;
export const defaultZoomValue = 50;
export const zoomCountDifference = 15;

const useCanvasZoomPanSurfaceStore = create(
  combine(
    {
      zoom: defaultZoomValue,
      position: { x: 0, y: 0 }, // visual absolute position
      alignment: "pan" as ViewAlignment,
    },

    (set, get) => ({
      /** Set zoom value (clamped) */
      setZoom: (value: number) => {
        set({ zoom: clampZoom(value, minZoomLevel, maxZoomLevel) });
      },

      /** Zoom in by default increment */
      zoomIn: () => {
        const { zoom } = get();
        set({
          zoom: clampZoom(
            zoom + zoomCountDifference,
            minZoomLevel,
            maxZoomLevel
          ),
        });
      },

      /** Zoom out by default decrement */
      zoomOut: () => {
        const { zoom } = get();
        set({
          zoom: clampZoom(
            zoom - zoomCountDifference,
            minZoomLevel,
            maxZoomLevel
          ),
        });
      },

      /** Zoom by a specific amount */
      zoomBy: (amount: number) => {
        const { zoom } = get();
        set({ zoom: clampZoom(zoom + amount, minZoomLevel, maxZoomLevel) });
      },

      /** Cycle through zoom presets */
      cycleZoomPreset: () => {
        const { zoom } = get();
        set({ zoom: getNextZoomPreset(zoom, presetZoomLevels) });
      },

      /** Set absolute position (marks as pan mode) */
      setPosition: (x: number, y: number) => {
        set({ position: { x, y }, alignment: "pan" });
      },

      /** Set absolute position without changing alignment mode
       * Useful when the hook computes an aligned position and we want to apply
       * it without switching to 'pan'.
       */
      setPositionPreserve: (x: number, y: number) => {
        set({ position: { x, y } });
      },

      /** Move position by relative delta */
      positionBy: (dx: number, dy: number) => {
        const { position } = get();
        set({
          position: { x: position.x + dx, y: position.y + dy },
          alignment: "pan",
        });
      },

      /** Set alignment mode only (hook will compute position) */
      alignTo: (mode: ViewAlignmentAdjustment) => {
        set({ alignment: mode });
      },

      /** Toggle through alignment modes */
      toggleAlignment: () => {
        const { alignment, position } = get();
        const order: ViewAlignment[] = ["pan", "center", "start"];
        const next = getNextAlignment(alignment, order) as ViewAlignment;
        set({
          alignment: next,
          // Keep position when switching to pan, reset otherwise
          position: next === "pan" ? position : { x: 0, y: 0 },
        });
      },

      /** Reset position to origin with start alignment */
      resetPosition: () => {
        set({ position: { x: 0, y: 0 }, alignment: "start" });
      },

      /** Reset both zoom and position */
      resetView: () => {
        set({
          zoom: defaultZoomValue,
          position: { x: 0, y: 0 },
          alignment: "start",
        });
      },
    })
  )
);

export default useCanvasZoomPanSurfaceStore;
