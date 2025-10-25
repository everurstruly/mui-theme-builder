import CanvasLayout from "./CanvasLayout";
import CanvasBodyZoomPanSurface from "./ZoomPanSurface/ZoomPanSurface";
import ViewportSimulationFrame from "./ViewportSimulation/Frame/Frame";
import useViewportSimulationStore from "./ViewportSimulation/viewportSimulationStore";
// import BoardSurface from "./BoardSurface";
// import { useTheme } from "@mui/material/styles";

export default function EditorCanvas() {
  const width = useViewportSimulationStore((s) => s.width);
  const height = useViewportSimulationStore((s) => s.height);
  const selectedComponent = useViewportSimulationStore(
    (s) => s.selectedComponent
  );

  // const theme = useTheme();
  // return (
  //   <CanvasLayout>
  //     <BoardSurface component={selectedComponent} theme={theme} />
  //   </CanvasLayout>
  // )

  return (
    <CanvasLayout>
      <CanvasBodyZoomPanSurface>
        <ViewportSimulationFrame
          bordered
          width={width}
          height={height}
          component={selectedComponent}
        />
      </CanvasBodyZoomPanSurface>
    </CanvasLayout>
  );
}
