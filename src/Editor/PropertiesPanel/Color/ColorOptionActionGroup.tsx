import { Box, Typography } from "@mui/material";
import ColorOptionActionGroupItem from "./ColorOptionActionGroupItem";
import { useThemeSheetTheme } from "../../ThemeSheet";

function ColorOptionActionGroup(props: { title?: string }) {
  const theme = useThemeSheetTheme();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        gap: 2,
      }}
    >
      {props.title && (
        <Typography
          variant="h6"
          sx={{
            gridColumn: "1 / -1",
            mb: 2,
          }}
        >
          {props.title}
        </Typography>
      )}
      <ColorOptionActionGroupItem
        path="palette.action.active"
        label="Active"
        resolvedValue={theme.palette.action.active}
      />
      <ColorOptionActionGroupItem
        path="palette.action.hover"
        label="Hover"
        resolvedValue={theme.palette.action.hover}
      />
      <ColorOptionActionGroupItem
        path="palette.action.selected"
        label="Selected"
        resolvedValue={theme.palette.action.selected}
      />
      <ColorOptionActionGroupItem
        path="palette.action.disabled"
        label="Disabled"
        resolvedValue={theme.palette.action.disabled}
      />
      <ColorOptionActionGroupItem
        path="palette.action.disabledBackground"
        label="Disabled Background"
        resolvedValue={theme.palette.action.disabledBackground}
      />
      <ColorOptionActionGroupItem
        path="palette.action.focus"
        label="Focus"
        resolvedValue={theme.palette.action.focus}
      />
    </Box>
  );
}

export default ColorOptionActionGroup;

