import CanvasLayout from "./CanvasLayout";
import CanvasBodyZoomPanSurface from "./ZoomPanSurface/ZoomPanSurface";
import ViewportSimulationFrame from "./ViewportSimulation/Frame/Frame";
import useViewportSimulationStore from "./ViewportSimulation/viewportSimulationStore";

export default function EditorCanvas() {
  const width = useViewportSimulationStore((s) => s.width);
  const height = useViewportSimulationStore((s) => s.height);
  const selectedComponent = useViewportSimulationStore(
    (s) => s.selectedComponent
  );

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
