import ColorSchemeToggle from "../Design/Edit/ColorSchemeToggle";
import ThemingExperienceTab from "../Toolsbar/ExperienceTab";
import { Box } from "@mui/material";

export default function PropertiesPanelHeader() {
  return (
    <>
      <Box display="inherit" columnGap={"inherit"}>
        <ColorSchemeToggle />
      </Box>

      <Box display={"inherit"} columnGap={"inherit"}>
        <ThemingExperienceTab />
      </Box>
    </>
  );
}
