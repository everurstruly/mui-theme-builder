import CanvasPropertiesPanel from "../editor/CanvasPropertiesPanel";
import CanvasToolbar from "../editor/CanvasToolbar";
import CanvasBoard from "../editor/CanvasBoard";
import Canvas from "../editor/Canvas";
import layoutStyles from "../editor/layout-styles";
import CanvasActivitiesPanel from "../editor/CanvasActivitiesPanel";
import { useState } from "react";
import { ScopedCssBaseline } from "@mui/material";

export default function EditorPage() {
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);

  const handleShowPropertyPanel = (value: boolean) => {
    setShowPropertyPanel(value);
  };

  return (
    <>
      <ScopedCssBaseline enableColorScheme />

      <Canvas
        renderBoard={() => <CanvasBoard />}
        renderActivityPanel={() => <CanvasActivitiesPanel />}
        renderToolbar={() => (
          <CanvasToolbar
            isShowingPropertyPanel={showPropertyPanel}
            handleShowPropertyPanel={handleShowPropertyPanel}
          />
        )}
        renderProperties={() => (
          <CanvasPropertiesPanel
            isVisible={showPropertyPanel}
            styles={{ root: layoutStyles.properties }}
          />
        )}
      />
    </>
  );
}
