import ColorSchemeToggle from "../Design/Edit/ColorSchemeToggle";
import DeveloperModeSwitch from "./DeveloperModeSwitch";
import { Box, Stack, type SxProps } from "@mui/material";
import { panelPaddingInlineRem } from "./DesignerPropertiesPanel";

export default function PropertiesPanelHeader({ sx }: { sx?: SxProps }) {
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      sx={{ px: panelPaddingInlineRem, ...sx }}
      gap={2}
    >
      <Box display="inherit" columnGap={"inherit"}>
        <ColorSchemeToggle />
      </Box>

      <Box display="inherit" columnGap={"inherit"}>
        <DeveloperModeSwitch />
      </Box>
    </Stack>
  );
}
