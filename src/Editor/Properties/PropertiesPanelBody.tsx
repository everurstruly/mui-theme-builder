import { Box, Stack } from "@mui/material";
import useEditorStore from "../useEditor";
import DeveloperPropertiesPanel from "./DeveloperPropertiesPanel";
import DesignerPropertiesPanel from "./DesignerPropertiesPanel";

export default function PanelBody() {
  const selectedExperienceId = useEditorStore((state) => state.selectedExperience);
  const setMouseOverPropertiesPanel = useEditorStore(
    (state) => state.setMouseOverPropertiesPanel
  );

  return (
    <Stack
      onMouseEnter={() => setMouseOverPropertiesPanel(true)}
      onMouseLeave={() => setMouseOverPropertiesPanel(false)}
      sx={{
        height: "100%",
        overflow: "hidden",

        // create content window
        position: "relative",
        transform: "translateX(0px)",
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: selectedExperienceId === "designer" ? "block" : "none",
        }}
      >
        <DesignerPropertiesPanel />
      </Box>

      <Box
        sx={{
          height: "100%",
          display: selectedExperienceId === "developer" ? "block" : "none",
        }}
      >
        <DeveloperPropertiesPanel />
      </Box>
    </Stack>
  );
}
