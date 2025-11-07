import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { FolderOutlined } from "@mui/icons-material";
import { useThemeWorkspaceStore } from "../ThemeWorkspaceV2";
import {
  getStaticThemeOptionsTemplate,
  themeOptionsTemplateIds,
  themeOptionsTemplatesToMetadata,
  type ThemeOptionTemplateId,
} from "../ThemeWorkspaceV2/themeOptionsTemplates";

export default function ThemeWorkspaceSelectMenu() {
  const selectedThemeOptionsTemplateId = useThemeWorkspaceStore((state) => {
    return state.selectedThemeOptionsTemplateId;
  });
  const selectThemeOptionsTemplate = useThemeWorkspaceStore((state) => {
    return state.selectThemeOptionsTemplate;
  });
  const applyThemeOptionsTemplate = useThemeWorkspaceStore((state) => {
    return state.applyThemeOptionsTemplate;
  });

  const handleChange = (event: SelectChangeEvent<ThemeOptionTemplateId>) => {
    const themeId = event.target.value;
    selectThemeOptionsTemplate(themeId);
    applyThemeOptionsTemplate(getStaticThemeOptionsTemplate(themeId), "replace");
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
        value={selectedThemeOptionsTemplateId}
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
        {themeOptionsTemplateIds.map((themeId) => (
          <MenuItem key={themeId} value={themeId}>
            {themeOptionsTemplatesToMetadata[themeId]?.label || themeId}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
