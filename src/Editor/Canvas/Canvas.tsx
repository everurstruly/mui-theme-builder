import PlainSurface from "./PlainSurface/PlainSurface";
import ExplorerPanelVisibilityToggle from "../Toolbar/ExplorerPanelVisibilityToggle";
import FullpagePreviewButton from "./PlainSurface/Controls/FullpagePreviewButton";
import CanvasFrame from "./CanvasFrame";
import QuickPreviewBar from "../Explorer/QuickPreviewBar";
import { alpha, Stack } from "@mui/material";
import { useRef } from "react";
import { BreakpointSimulationToggles } from "./PlainSurface/BreakpointSimulation";

export default function EditorCanvas() {
  const previewDivWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <CanvasFrame
      controls={{
        bottomCenter: (
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
            <BreakpointSimulationToggles />
            <FullpagePreviewButton />
          </Stack>
        ),
      }}
    >
      <QuickPreviewBar />
      <PlainSurface containerRef={previewDivWrapperRef} />
    </CanvasFrame>
  );
}
