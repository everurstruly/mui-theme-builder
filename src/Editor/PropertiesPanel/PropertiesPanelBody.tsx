import { Box } from "@mui/material";
import { editorExperiences } from "../themingExperience";
import { useEditorExperienceStore } from "../useThemingExperienceStore";
import useEditorUiStore from "../editorUiStore";

export default function PanelBody() {
  const selectedExperienceId = useEditorExperienceStore(
    (state) => state.selectedExperienceId
  );
  const selectedExperience = editorExperiences[selectedExperienceId];

  const setMouseOverPropertiesPanel = useEditorUiStore(
    (state) => state.setMouseOverPropertiesPanel
  );

  if (selectedExperience.renderPropsPanel) {
    return (
      <Box
        height={"100%"}
        onMouseEnter={() => setMouseOverPropertiesPanel(true)}
        onMouseLeave={() => setMouseOverPropertiesPanel(false)}
      >
        {selectedExperience.renderPropsPanel()}
      </Box>
    );
  }
}

