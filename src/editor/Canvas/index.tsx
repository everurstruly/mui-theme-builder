import CanvasLayout from "./CanvasLayout";
import DashboardExample from "./frames/DashboardExample";
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
