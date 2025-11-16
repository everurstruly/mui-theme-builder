import Typography from "@mui/material/Typography";
import { editorExperiences } from "../Design/designExperience";
import { useDesignStore } from "../Design/designStore";

export default function ExplorerPanelHeader() {
  const selectedTabId = useDesignStore((state) => state.selectedExperienceId);
  const selectedTab = editorExperiences[selectedTabId];

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
