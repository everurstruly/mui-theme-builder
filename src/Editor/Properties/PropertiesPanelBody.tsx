import useEditorUiStore from "../useEditorStore";
import { Box } from "@mui/material";
import { editorDesignExperiences } from "../editorDesignExperience";
import { useDesignStore } from "../Design/Current/designStore";

export default function PanelBody() {
  const selectedExperienceId = useDesignStore((state) => state.selectedExperienceId);
  const selectedExperience = editorDesignExperiences[selectedExperienceId];

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
