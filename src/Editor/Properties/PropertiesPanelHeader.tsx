import ColorSchemeToggle from "../Design/Current/ColorSchemeToggle";
import EditorExperienceTab from "../ExperienceTab";
import { Box, Stack, type SxProps, type Theme } from "@mui/material";

export default function PropertiesPanelHeader({ sx }: { sx?: SxProps<Theme> }) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{ ...sx }}
      gap={2}
    >
      <Box display="inherit" columnGap={"inherit"}>
        <ColorSchemeToggle />
      </Box>

      <Box display="inherit" columnGap={"inherit"}>
        <EditorExperienceTab />
      </Box>
    </Stack>
  );
}
