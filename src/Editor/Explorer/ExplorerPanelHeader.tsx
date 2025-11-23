import Typography from "@mui/material/Typography";
import { editorDesignExperiences } from "../editorDesignExperience";
import { useDesignStore } from "../Design/designStore";

export default function ExplorerPanelHeader() {
  const selectedTabId = useDesignStore((state) => state.selectedExperienceId);
  const selectedTab = editorDesignExperiences[selectedTabId];

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
