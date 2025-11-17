import DesignColorSchemeToggle from "../Activities/DesignColorSchemeToggle";
import ThemingExperienceTab from "../Activities/DesignExperienceTab";
import { Box } from "@mui/material";

export default function PropertiesPanelHeader() {
  return (
    <>
      <Box display="inherit" columnGap={"inherit"}>
        <DesignColorSchemeToggle />
      </Box>

      <Box display={"inherit"} columnGap={"inherit"}>
        <ThemingExperienceTab />
      </Box>
    </>
  );
}
