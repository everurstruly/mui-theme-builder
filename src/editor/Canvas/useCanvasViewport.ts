import { create } from "zustand";
import { useCallback, useEffect, useRef } from "react";
import { combine } from "zustand/middleware";

const canvasViewportPresets = {
  phone: { w: 375, h: 812 },
  tablet: { w: 768, h: 1024 },
  laptop: { w: 1366, h: 768 },
  tv: { w: 1920, h: 1080 },
};

export type CanvasViewportPreset = keyof typeof canvasViewportPresets;

const useCanvasViewportStore = create(
  combine(
    {
      scale: 1,
      preset: "phone" as CanvasViewportPreset,
      width: canvasViewportPresets.phone.w,
      height: canvasViewportPresets.phone.h,
    },

    (set, get) => ({
      viewPreset: (preset: CanvasViewportPreset) => {
        const p = canvasViewportPresets[preset];
        set((state) => {
          return {
            ...state,
            preset,
            width: p.w,
            height: p.h,
          };
        });
      },

      viewSize: ({ width, height }: Record<string, number>) => {
        set((state) => ({
          ...state,
          width: Math.round(width),
          height: Math.round(height),
        }));
      },

      setWidth: (width: number) => {
        set((state) => {
          return {
            ...state,
            preset: undefined,
            width: Math.round(width),
          };
        });
      },

      setHeight: (height: number) => {
        set((state) => {
          return {
            ...state,
            preset: undefined,
            height: Math.round(height),
          };
        });
      },

      scaleView: ({
        containerWidth,
        contentWidth,
      }: {
        containerWidth: number;
        contentWidth: number;
      }) => {
        set((state) => {
          const scale = Math.min(containerWidth / contentWidth, 1);
          return {
            ...state,
            scale,
          };
        });
      },

      rotateView: () => {
        const { width, height } = get();
        set((state) => ({
          ...state,
          width: height,
          height: width,
        }));
      },

      getView: () => {
        const { preset, width, height, scale } = get();
        return { preset, width, height, scale };
      },
    })
  )
);

export default function useCanvasViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useCanvasViewportStore((state) => state.scale);
  const preset = useCanvasViewportStore((state) => state.preset);
  const width = useCanvasViewportStore((state) => state.width);
  const height = useCanvasViewportStore((state) => state.height);
  const viewSize = useCanvasViewportStore((state) => state.viewSize);
  const viewPreset = useCanvasViewportStore((state) => state.viewPreset);
  const scaleView = useCanvasViewportStore((state) => state.scaleView);

  const resize = useCallback(() => {
    if (!containerRef.current) {
      return;
    }

    const containerWidth = containerRef.current.offsetWidth;
    const height = containerRef.current.offsetHeight;

    viewSize({ width, height });
    scaleView({ containerWidth, contentWidth: width });
  }, [viewSize, scaleView, width]);

  useEffect(() => {
    resize();
    window.addEventListener("load", resize);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("load", resize);
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  return {
    containerRef,
    scale,
    width,
    height,
    preset,
    viewPreset,
    viewSize,
  };
}
