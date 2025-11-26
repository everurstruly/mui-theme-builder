import useEditorUiStore from "../useEditor";
import { Box } from "@mui/material";
import { editorDesignExperience } from "../editorExperience";
import { useCurrentDesign } from "../Design/Current/useCurrent";

export default function PanelBody() {
  const selectedExperienceId = useCurrentDesign((state) => state.selectedExperienceId);
  const selectedExperience = editorDesignExperience[selectedExperienceId];

  const setMouseOverPropertiesPanel = useEditorUiStore(
    (state) => state.setMouseOverPropertiesPanel
  );

  if (selectedExperience.renderPropsPanel) {
    return (
      <Box
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
        {selectedExperience.renderPropsPanel()}
      </Box>
    );
  }
}
