import ColorSchemeToggle from "../Design/Current/Modify/ColorSchemeToggle";
import { Box, Stack, type SxProps, type Theme } from "@mui/material";
import EditorExperienceTab from "./Experiences/ExperienceTab";

export default function PropertiesPanelHeader({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{...sx }}
      gap={2}
    >
      <Box display="inherit" columnGap={"inherit"}>
        <EditorExperienceTab />
      </Box>
      <Box display="inherit" columnGap={"inherit"}>
        <ColorSchemeToggle />
      </Box>
    </Stack>
  );
}
