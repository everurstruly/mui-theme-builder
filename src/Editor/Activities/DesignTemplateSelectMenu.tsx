import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useThemeDesignStore } from "../Design";
import { useTemplateStore } from "../Templates/useTemplateStore";
import { serializeThemeOptions } from "../Design/codeParser";

export default function DesignTemplateSelectMenu() {
  const baseThemeMetadata = useThemeDesignStore((state) => state.baseThemeMetadata);
  const setBaseTheme = useThemeDesignStore((state) => state.setBaseTheme);
  const { getAllTemplates, getTemplateById } = useTemplateStore();

  const templates = getAllTemplates();
  const selectedTemplateId = baseThemeMetadata?.sourceTemplateId ?? "material";

  const handleChange = (event: SelectChangeEvent<string>) => {
    const themeId = event.target.value as string;
    const template = getTemplateById(themeId);
    if (!template) return;

    // Serialize template ThemeOptions to JSON string
    const themeCode = serializeThemeOptions(template.themeOptions);
    
    // Set base theme with metadata (store will manage createdAt/lastModified)
    setBaseTheme(themeCode, {
      sourceTemplateId: themeId,
      title: template.label,
    });
  };

  return (
    <FormControl
      sx={{ mx: 1.25, width: "100%", maxWidth: { lg: "22ch" } }}
      size="small"
      color="primary"
    >
      <Select
        labelId="theme-select-label"
        id="theme-select"
        value={selectedTemplateId}
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
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

