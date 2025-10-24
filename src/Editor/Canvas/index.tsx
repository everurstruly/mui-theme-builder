import CanvasLayout from "./CanvasLayout";
import CanvasBodyZoomPan from "./ZoomPanSurface";
import ViewportSimulationFrame from "./ViewportSimulation/Frame";
import useViewportSimulationStore from "./ViewportSimulation/viewportSimulationStore";

export default function EditorCanvas() {
  const width = useViewportSimulationStore((s) => s.width);
  const height = useViewportSimulationStore((s) => s.height);
  const selectedComponent = useViewportSimulationStore(
    (s) => s.selectedComponent
  );

  return (
    <CanvasLayout>
      <CanvasBodyZoomPan>
        <ViewportSimulationFrame
          width={width}
          height={height}
          component={selectedComponent}
        />
      </CanvasBodyZoomPan>
    </CanvasLayout>
  );
}
