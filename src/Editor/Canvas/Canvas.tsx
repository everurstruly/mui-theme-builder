import PlainSurface from "./PlainSurface/PlainSurface";
import FullscreenPreviewButton from "./PlainSurface/Controls/FullscreenPreviewButton";
import ExplorerPanelVisibilityToggle from "../Activities/ExplorerPanelVisibilityToggle";
import CanvasFrame from "./CanvasFrame";
import { alpha, Stack } from "@mui/material";
import { useRef } from "react";
import { BreakpointSimulationToggles } from "./PlainSurface/BreakpointSimulation";

export default function EditorCanvas() {
  const previewDivWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <CanvasFrame
      controls={{
        bottomLeft: (
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              backdropFilter: "blur(12px)",
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
              columnGap: 1,
              px: 0.25,
            }}
          >
            <ExplorerPanelVisibilityToggle />
          </Stack>
        ),

        bottomRight: (
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              backdropFilter: "blur(12px)",
              borderRadius: 2,
              backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.8),
              columnGap: 1,
              px: 0.25,
            }}
          >
            <BreakpointSimulationToggles />
            <FullscreenPreviewButton containerRef={previewDivWrapperRef} />
          </Stack>
        ),
      }}
    >
      <PlainSurface containerRef={previewDivWrapperRef} />
    </CanvasFrame>
  );
}
