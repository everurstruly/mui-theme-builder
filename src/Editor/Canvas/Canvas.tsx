import useViewportSimulationStore from "./ZoomPanSurface/ViewportSimulation/viewportSimulationStore";
import CanvasBodyZoomPanSurface from "./ZoomPanSurface/ZoomPanSurface";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function EditorCanvas() {
  const theme = useTheme();
  const selectedComponent = useViewportSimulationStore(
    (s) => s.selectedComponent
  );

  return (
    <Box
      sx={(theme) => ({
        position: "relative", // acts as the board/wrapper for surfaces
        flexGrow: 1,
        minWidth: 0, // <-- ensure this flex child can shrink
        overflow: "hidden", // <-- contain expansion, create clip/scroll context
        height: `calc(100% - var(--header-height))`,
        backgroundColor: "transparent",
        [theme.breakpoints.up("sm")]: {
          height: `calc(100% - var(--toolbar-height))`,
        },
      })}
    >
      <CanvasBodyZoomPanSurface component={selectedComponent} theme={theme} />
    </Box>
  );
}
