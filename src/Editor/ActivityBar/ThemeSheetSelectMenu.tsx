import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { PreviewRounded } from "@mui/icons-material";
import {
  useThemeDocumentStore,
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from "../ThemeDocument";

export default function ThemeSheetSelectMenu() {
  const selectedThemeTemplateId = useThemeDocumentStore((state) => {
    return state.selectedTemplateId.id;
  });
  const switchTemplate = useThemeDocumentStore((state) => {
    return state.switchTemplate;
  });

  const handleChange = (event: SelectChangeEvent<ThemeTemplateId>) => {
    const themeId = event.target.value as ThemeTemplateId;
    // switchTemplate takes (templateId, keepEdits) - false to reset edits when switching
    switchTemplate({ type: 'builtin', id: themeId }, false);
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
