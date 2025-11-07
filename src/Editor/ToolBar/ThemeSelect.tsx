import * as React from "react";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { FolderOutlined } from "@mui/icons-material";
import { useThemeWorkspaceStore, listBaseThemeIds } from "../ThemeWorkspace";

// Map of theme IDs to display names
const THEME_LABELS: Record<string, string> = {
  default: "Material UI",
  dark: "Material UI Dark",
  ios: "Apple iOS",
  material3: "Material Design 3",
};

export default function ThemeSelect() {
  const activeBaseTheme = useThemeWorkspaceStore((state) => state.activeBaseThemeOption);
  const setActiveBaseTheme = useThemeWorkspaceStore((state) => state.setActiveBaseTheme);
  
  const availableThemes = listBaseThemeIds();

  const handleChange = (event: SelectChangeEvent) => {
    const themeId = event.target.value;
    setActiveBaseTheme({ type: 'static', ref: themeId });
  };

  return (
    <FormControl
      sx={{ m: 0, width: "100%", maxWidth: { lg: "20ch" } }}
      size="small"
      variant="outlined"
    >
      <Select
        labelId="theme-select-label"
        id="theme-select"
        value={activeBaseTheme.ref}
        startAdornment={<FolderOutlined sx={{ marginRight: 1.5 }} color="action" />}
        onChange={handleChange}
        sx={{
          borderRadius: 2,
          fontSize: "small",
        }}
        slotProps={{
          notchedOutline: {
            sx: {
              borderColor: "divider",
            },
          },
        }}
      >
        {availableThemes.map((themeId) => (
          <MenuItem key={themeId} value={themeId}>
            {THEME_LABELS[themeId] || themeId}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
