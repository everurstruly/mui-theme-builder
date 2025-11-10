/**
 * Unified Canvas View Store
 * 
 * Replaces:
 * - zoomPanSurfaceStore (camera controls)
 * - viewportSimulationStore (viewport dimensions)
 * 
 * Benefits:
 * - Single source of truth
 * - No sync issues
 * - Computed values as selectors
 * - Clearer mental model
 */

import { create } from "zustand";
import { combine } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export const DEVICE_PRESETS = {
  phone: { w: 375, h: 667 },
  tablet: { w: 768, h: 1024 },
  laptop: { w: 1440, h: 900 },
  desktop: { w: 1920, h: 1080 },
} as const;

export type DevicePreset = keyof typeof DEVICE_PRESETS;
export type ViewAlignment = "center" | "start" | "pan";

export interface CanvasPreset {
  name: string;
  viewport: {
    width: number;
    height: number;
    preset?: DevicePreset;
  };
  camera: {
    zoom: number;
    position: { x: number; y: number };
    alignment: ViewAlignment;
  };
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

export const ZOOM_MIN = 20;
export const ZOOM_MAX = 300;
export const ZOOM_DEFAULT = 50;
export const ZOOM_STEP = 10;
export const ZOOM_PRESETS = [20, 50, 100, 150] as const;

// ============================================================================
// Utility Functions
// ============================================================================

function clampZoom(value: number): number {
  return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, value));
}

function getNextZoomPreset(current: number): number {
  const presets = [...ZOOM_PRESETS];
  const nextIndex = presets.findIndex((z) => z > current);
  return nextIndex === -1 ? presets[0] : presets[nextIndex];
}

function getNextAlignment(current: ViewAlignment): ViewAlignment {
  const order: ViewAlignment[] = ["pan", "center", "start"];
  const currentIndex = order.indexOf(current);
  return order[(currentIndex + 1) % order.length];
}

// ============================================================================
// Store
// ============================================================================

const useCanvasViewStore = create(
  combine(
    {
      // ========== Viewport (content dimensions) ==========
      viewport: {
        width: DEVICE_PRESETS.phone.w as number,
        height: DEVICE_PRESETS.phone.h as number,
        preset: "phone" as DevicePreset | undefined,
      },

      // ========== Camera (how we view the content) ==========
      camera: {
        zoom: ZOOM_DEFAULT,
        position: { x: 0, y: 0 },
        alignment: "center" as ViewAlignment,
        isDragging: false,
        dragLock: false, // When true, panning enabled (content pointer events disabled)
      },

      // ========== Presets (saved configurations) ==========
      presets: [] as CanvasPreset[],
    },

    (set, get) => ({
      // ========================================================================
      // Viewport Actions
      // ========================================================================

      setViewportPreset: (preset: DevicePreset) => {
        const { w, h } = DEVICE_PRESETS[preset];
        set({
          viewport: { width: w, height: h, preset },
        });
      },

      setViewportSize: (width: number, height: number) => {
        set({
          viewport: { width, height, preset: undefined },
        });
      },

      setViewportWidth: (width: number) => {
        const { viewport } = get();
        set({
          viewport: { ...viewport, width, preset: undefined },
        });
      },

      setViewportHeight: (height: number) => {
        const { viewport } = get();
        set({
          viewport: { ...viewport, height, preset: undefined },
        });
      },

      rotateViewport: () => {
        const { viewport } = get();
        set({
          viewport: {
            width: viewport.height,
            height: viewport.width,
            preset: undefined,
          },
        });
      },

      // ========================================================================
      // Camera: Zoom Actions
      // ========================================================================

      setZoom: (value: number) => {
        set((state) => ({
          camera: { ...state.camera, zoom: clampZoom(value) },
        }));
      },

      zoomIn: () => {
        const { camera } = get();
        set({
          camera: { ...camera, zoom: clampZoom(camera.zoom + ZOOM_STEP) },
        });
      },

      zoomOut: () => {
        const { camera } = get();
        set({
          camera: { ...camera, zoom: clampZoom(camera.zoom - ZOOM_STEP) },
        });
      },

      zoomBy: (amount: number) => {
        const { camera } = get();
        set({
          camera: { ...camera, zoom: clampZoom(camera.zoom + amount) },
        });
      },

      cycleZoomPreset: () => {
        const { camera } = get();
        const nextZoom = getNextZoomPreset(camera.zoom);
        set({
          camera: { ...camera, zoom: nextZoom },
        });
      },

      zoomToFit: (containerWidth: number, containerHeight: number) => {
        const { viewport } = get();
        const paddingFactor = 0.9; // 10% padding
        const availableWidth = containerWidth * paddingFactor;
        const availableHeight = containerHeight * paddingFactor;

        const scaleX = (availableWidth / viewport.width) * 100;
        const scaleY = (availableHeight / viewport.height) * 100;
        const fitZoom = Math.min(scaleX, scaleY, 100); // Don't zoom beyond 100%

        // Round to nearest 5 for cleaner values
        const roundedZoom = Math.round(fitZoom / 5) * 5;

        set((state) => ({
          camera: { ...state.camera, zoom: clampZoom(roundedZoom) },
        }));
      },

      // ========================================================================
      // Camera: Position Actions
      // ========================================================================

      setCameraPosition: (x: number, y: number) => {
        set((state) => ({
          camera: { ...state.camera, position: { x, y }, alignment: "pan" },
        }));
      },

      setCameraPositionPreserveAlignment: (x: number, y: number) => {
        set((state) => ({
          camera: { ...state.camera, position: { x, y } },
        }));
      },

      moveCameraBy: (dx: number, dy: number) => {
        const { camera } = get();
        set({
          camera: {
            ...camera,
            position: { x: camera.position.x + dx, y: camera.position.y + dy },
            alignment: "pan",
          },
        });
      },

      setCameraAlignment: (alignment: Exclude<ViewAlignment, "pan">) => {
        set((state) => ({
          camera: { ...state.camera, alignment },
        }));
      },

      toggleAlignment: () => {
        const { camera } = get();
        const next = getNextAlignment(camera.alignment);
        set({
          camera: {
            ...camera,
            alignment: next,
            position: next === "pan" ? camera.position : { x: 0, y: 0 },
          },
        });
      },

      setIsDragging: (isDragging: boolean) => {
        set((state) => ({
          camera: { ...state.camera, isDragging },
        }));
      },

      toggleDragLock: () => {
        set((state) => ({
          camera: { ...state.camera, dragLock: !state.camera.dragLock },
        }));
      },

      // ========================================================================
      // Reset Actions
      // ========================================================================

      resetCamera: () => {
        set((state) => ({
          camera: {
            ...state.camera,
            zoom: ZOOM_DEFAULT,
            position: { x: 0, y: 0 },
            alignment: "center",
          },
        }));
      },

      resetViewport: () => {
        const { w, h } = DEVICE_PRESETS.phone;
        set({
          viewport: { width: w, height: h, preset: "phone" },
        });
      },

      resetAll: () => {
        const { w, h } = DEVICE_PRESETS.phone;
        set({
          viewport: { width: w, height: h, preset: "phone" },
          camera: {
            zoom: ZOOM_DEFAULT,
            position: { x: 0, y: 0 },
            alignment: "center",
            isDragging: false,
            dragLock: true,
          },
        });
      },

      // ========================================================================
      // Preset Actions
      // ========================================================================

      savePreset: (name: string) => {
        const { viewport, camera, presets } = get();
        const newPreset: CanvasPreset = {
          name,
          viewport: { ...viewport },
          camera: {
            zoom: camera.zoom,
            position: { ...camera.position },
            alignment: camera.alignment,
          },
          timestamp: Date.now(),
        };

        // Remove existing preset with same name, then add new one
        const filtered = presets.filter((p) => p.name !== name);
        set({ presets: [...filtered, newPreset] });
      },

      loadPreset: (name: string) => {
        const { presets } = get();
        const preset = presets.find((p) => p.name === name);
        if (!preset) {
          console.warn(`Preset "${name}" not found`);
          return;
        }

        set({
          viewport: {
            width: preset.viewport.width,
            height: preset.viewport.height,
            preset: preset.viewport.preset,
          },
          camera: {
            ...get().camera, // Preserve isDragging and dragLock
            zoom: preset.camera.zoom,
            position: { ...preset.camera.position },
            alignment: preset.camera.alignment,
          },
        });
      },

      deletePreset: (name: string) => {
        set((state) => ({
          presets: state.presets.filter((p) => p.name !== name),
        }));
      },

      getAllPresets: () => {
        return get().presets;
      },

      // ========================================================================
      // Selectors (Computed Values)
      // ========================================================================

      getScale: () => {
        return get().camera.zoom / 100;
      },

      getViewportDimensions: () => {
        const { viewport } = get();
        return { width: viewport.width, height: viewport.height };
      },

      getScaledDimensions: () => {
        const { viewport, camera } = get();
        const scale = camera.zoom / 100;
        return {
          width: viewport.width * scale,
          height: viewport.height * scale,
        };
      },
    })
  )
);

export default useCanvasViewStore;

