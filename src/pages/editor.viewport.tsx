import { useSearchParams } from "react-router";
import { Helmet } from "react-helmet";
import { samplesRegistry } from "../Editor/Previews/registry";
import CanvasViewportSimulationPreviewPage from "../Editor/Canvas/ZoomPanSurface/ViewportSimulation/PreviewPage";

/**
 * Usage:
 * /viewport?component=DashboardExample&theme=<base64-encoded-theme>
 */
export default function EditorViewportPage() {
  const [searchParams] = useSearchParams();
  return (
    <>
      <Helmet>
        <meta name="keywords" content="generator, mui theme creator, mui theme editor, mui v6, material ui, theme builder, theme generator, theme editor, MUI v6, MUI themes" />
      </Helmet>

      <CanvasViewportSimulationPreviewPage
        samplesRegistry={samplesRegistry}
        componentId={searchParams.get("component") ?? undefined}
        encodedTheme={searchParams.get("theme") ?? undefined}
      />
    </>
  );
}
