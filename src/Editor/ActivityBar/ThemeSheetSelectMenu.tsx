import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PreviewRounded } from "@mui/icons-material";
import { useThemeSheetStore } from "../ThemeSheet";
import {
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from "../ThemeSheet";

export default function ThemeSheetSelectMenu() {
  const selectedThemeTemplateId = useThemeSheetStore((state) => {
    return state.selectedThemeTemplateId.id;
  });
  const selectThemeTemplate = useThemeSheetStore((state) => {
    return state.selectThemeTemplate;
  });
  const commitEdits = useThemeSheetStore((state) => {
    return state.commitEdits;
  });

  const handleChange = (event: SelectChangeEvent<ThemeTemplateId>) => {
    const themeId = event.target.value as ThemeTemplateId;
    selectThemeTemplate({ type: "static", id: themeId });
    // Applying the template now clears the user edits
    commitEdits();
  };

  return (
    <FormControl
      sx={{ m: 0, width: "100%", maxWidth: { lg: "22ch" } }}
      size="small"
      color="primary"
    >
      <Select
        labelId="theme-select-label"
        id="theme-select"
        value={selectedThemeTemplateId}
        startAdornment={
          <PreviewRounded sx={{ marginRight: 1.25, color: "primary.main" }} />
        }
        onChange={handleChange}
        sx={{
          borderRadius: 2,
          fontSize: "small",
        }}
        slotProps={{
          notchedOutline: {
            sx: {
              // borderColor: "divider",
            },
          },
        }}
      >
        {listThemeTemplateIds().map((themeId) => (
          <MenuItem key={themeId} value={themeId}>
            {THEME_TEMPLATE_METADATA[themeId]?.label || themeId}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
