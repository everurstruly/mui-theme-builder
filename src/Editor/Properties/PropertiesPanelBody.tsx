import useEditorUiStore from "../editorStore";
import { Box } from "@mui/material";
import { editorExperiences } from "../Design/designExperience";
import { useDesignStore } from "../Design/designStore";

export default function PanelBody() {
  const selectedExperienceId = useDesignStore((state) => state.selectedExperienceId);
  const selectedExperience = editorExperiences[selectedExperienceId];

  const setMouseOverPropertiesPanel = useEditorUiStore(
    (state) => state.setMouseOverPropertiesPanel
  );

  if (selectedExperience.renderPropsPanel) {
    return (
      <Box
        height={"100%"}
        overflow={"auto"}
        onMouseEnter={() => setMouseOverPropertiesPanel(true)}
        onMouseLeave={() => setMouseOverPropertiesPanel(false)}
      >
        {selectedExperience.renderPropsPanel()}
      </Box>
    );
  }
}
