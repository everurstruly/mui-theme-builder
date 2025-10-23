import CanvasLayout from "./CanvasLayout";
import DashboardExample from "./Objects/DashboardExample";
import CanvasBodyZoomPan from "./ZoomPanSurface";

export default function EditorCanvas() {
  return (
    <CanvasLayout>
      <CanvasBodyZoomPan>
        <DashboardExample />
      </CanvasBodyZoomPan>
    </CanvasLayout>
  );
}
