import { useSearchParams } from "react-router";
import { samplesRegistry } from "../Editor/Previews/registry";
import CanvasViewportSimulationPreviewPage from "../Editor/Canvas/ZoomPanSurface/ViewportSimulation/PreviewPage";

/**
 * Usage:
 * /viewport?component=DashboardExample&theme=<base64-encoded-theme>
 */
export default function EditorViewportPage() {
  const [searchParams] = useSearchParams();
  return (
    <CanvasViewportSimulationPreviewPage
      samplesRegistry={samplesRegistry}
      componentId={searchParams.get("component") ?? undefined}
      encodedTheme={searchParams.get("theme") ?? undefined}
    />
  );
}
