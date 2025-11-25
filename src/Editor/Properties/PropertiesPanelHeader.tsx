import DesignColorSchemeToggle from "../Design/Current/DesignColorSchemeToggle";
import ThemingExperienceTab from "../Toolsbar/DesignExperienceTab";
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
