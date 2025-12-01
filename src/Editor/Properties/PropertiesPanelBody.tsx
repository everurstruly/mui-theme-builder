import useEditor from "../useEditor";
import DeveloperPropertiesPanel from "./DeveloperPropertiesPanel";
import DesignerPropertiesPanel from "./DesignerPropertiesPanel";
import { Stack } from "@mui/material";

export default function PanelBody() {
  const selectedExperienceId = useEditor((state) => state.selectedExperience);
  const setMouseOverPropertiesPanel = useEditor(
    (state) => state.setMouseOverPropertiesPanel
  );

  return (
    <Stack
      onMouseEnter={() => setMouseOverPropertiesPanel(true)}
      onMouseLeave={() => setMouseOverPropertiesPanel(false)}
      sx={{
        height: "100%",
        overflow: "hidden",

        // css: create content window
        position: "relative",
        transform: "translateX(0px)",
      }}
    >
      {selectedExperienceId === "designer" && <DesignerPropertiesPanel />}
      {selectedExperienceId === "developer" && <DeveloperPropertiesPanel />}
    </Stack>
  );
}
