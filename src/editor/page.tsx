import CanvasPropertiesPanel from "./CanvasPropertiesPanel";
import CanvasToolbar from "./CanvasToolbar";
import CanvasBoard from "./CanvasBoard";
import Canvas from "./Canvas";
import layoutStyles from "./layout-styles";
import CanvasActivityPanel from "./CanvasActivitiesPanel";
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
        sx={{
          height: layoutStyles.canvas.height,
        }}
        renderActivityPanel={() => <CanvasActivityPanel />}
        renderToolbar={() => (
          <CanvasToolbar
            isShowingPropertyPanel={showPropertyPanel}
            handleShowPropertyPanel={handleShowPropertyPanel}
          />
        )}
        renderBoard={() => <CanvasBoard />}
        renderProperties={() => (
          <CanvasPropertiesPanel isShowing={showPropertyPanel} />
        )}
      />
    </>
  );
}
