import CanvasLayout from "./CanvasLayout";
import DashboardExample from "./frames/DashboardExample";
import CanvasBodyFitContent from "./CanvasBodyFitContent";

export default function EditorCanvas() {
  return (
    <CanvasLayout>
      <CanvasBodyFitContent>
        <DashboardExample />
      </CanvasBodyFitContent>
    </CanvasLayout>
  );
}
