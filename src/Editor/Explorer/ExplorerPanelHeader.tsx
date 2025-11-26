import Typography from "@mui/material/Typography";
import { editorDesignExperience } from "../editorExperience";
import { useCurrentDesign } from "../Design/Current/useCurrent";

export default function ExplorerPanelHeader() {
  const selectedTabId = useCurrentDesign((state) => state.selectedExperienceId);
  const selectedTab = editorDesignExperience[selectedTabId];

  if (!selectedTab) return null;

  return (
    <Typography
      variant="body2"
      fontWeight={500}
      sx={{
        py: 2.5,
        px: { xs: 2 },
      }}
    >
      {selectedTab.navigationPanelTitle || `${selectedTab.title} Navigation`}
    </Typography>
  );
}
