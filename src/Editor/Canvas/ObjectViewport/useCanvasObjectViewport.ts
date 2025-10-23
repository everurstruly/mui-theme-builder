import useEditorStore from "../../editorStore";
import { create } from "zustand";
import { useCallback, useRef, useLayoutEffect } from "react";
import { combine } from "zustand/middleware";

export default function useCanvasObjectViewport() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hiddenPanels = useEditorStore((state) => state.hiddenPanels);
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
    scaleView({ containerWidth });
  }, [viewSize, scaleView, width]);

  useLayoutEffect(() => {
    resize();
    window.addEventListener("load", resize);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("load", resize);
      window.removeEventListener("resize", resize);
    };
  }, [resize]);

  useLayoutEffect(() => {
    resize();
  }, [hiddenPanels, resize]);

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

      scaleView: ({ containerWidth }: { containerWidth: number }) => {
        set((state) => {
          const contentWidth = state.width;
          const contentHeight = state.height;

          if (!contentWidth || !contentHeight) return state;

          // Base scale on container width
          let scale = containerWidth / contentWidth;

          // If height multiplied by scale exceeds container, reduce scale
          const containerHeight =
            containerWidth * (contentHeight / contentWidth); // approximate available height
          if (contentHeight * scale > containerHeight) {
            scale = containerHeight / contentHeight;
          }

          // Clamp scale to reasonable limits
          const MIN_SCALE = 0.8; // shrink no smaller than 80%
          const MAX_SCALE = 1; // grow no larger than original size
          scale = Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);

          return { ...state, scale };
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
