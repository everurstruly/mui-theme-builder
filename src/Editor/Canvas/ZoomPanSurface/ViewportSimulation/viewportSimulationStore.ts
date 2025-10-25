import { create } from "zustand";
import { combine } from "zustand/middleware";

export const viewportSimulationDevicePresets = {
  phone: { w: 375, h: 667 },
  tablet: { w: 768, h: 1024 },
  laptop: { w: 1440, h: 900 },
  desktop: { w: 1920, h: 1080 },
} as const;

export type ViewportSimulaitonDevicePreset =
  keyof typeof viewportSimulationDevicePresets;

const useViewportSimulationStore = create(
  combine(
    {
      scale: 1,
      preset: "phone" as ViewportSimulaitonDevicePreset | undefined,
      width: viewportSimulationDevicePresets.phone.w as number,
      height: viewportSimulationDevicePresets.phone.h as number,
      selectedComponent: "DashboardExample", // Currently selected component to render
    },
    (set, get) => ({
      setPreset: (preset: ViewportSimulaitonDevicePreset) => {
        const { w, h } = viewportSimulationDevicePresets[preset];
        set({ preset, width: w, height: h });
      },

      setSize: (width: number, height: number) => {
        set({ width, height, preset: undefined });
      },

      setWidth: (width: number) => {
        set({ width, preset: undefined });
      },

      setHeight: (height: number) => {
        set({ height, preset: undefined });
      },

      rotateViewport: () => {
        const { width, height } = get();
        set({ width: height, height: width });
      },

      setScale: (scale: number) => {
        set({ scale });
      },

      scaleViewport: (containerWidth: number, containerHeight: number) => {
        const { width: contentWidth, height: contentHeight } = get();

        if (!contentWidth || !contentHeight) return;

        // Calculate scale to fit viewport in container
        const scaleX = containerWidth / contentWidth;
        const scaleY = containerHeight / contentHeight;
        const scale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%

        set({ scale });
      },

      setSelectedComponent: (componentId: string) => {
        set({ selectedComponent: componentId });
      },

      resetViewport: () => {
        const { w, h } = viewportSimulationDevicePresets.phone;
        set({ preset: "phone", width: w, height: h, scale: 1 });
      },
    })
  )
);

export default useViewportSimulationStore;
