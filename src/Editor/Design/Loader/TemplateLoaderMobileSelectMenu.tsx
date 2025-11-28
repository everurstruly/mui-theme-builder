import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import useTemplateLoader from "./useTemplateLoader";

export default function TemplateLoaderMobileSelectMenu() {
  const {
    templates,
    selectedTemplateId = "__DEFAULT__",
    selectTemplate,
  } = useTemplateLoader();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const themeId = event.target.value as string;
    selectTemplate(themeId, { keepUnsavedModifications: false });
  };

  return (
    <FormControl
      sx={{ mx: 1.25, width: "100%", maxWidth: { lg: "22ch" } }}
      size="small"
      color="primary"
    >
      <Select
        id="theme-select"
        labelId="theme-select-label"
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
        <MenuItem value="__DEFAULT__">Default</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
