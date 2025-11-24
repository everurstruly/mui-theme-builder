import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import useTemplateSelection from "../Templates/useTemplateSelection";

export default function TemplateSelectBox() {
  const { templates, selectedTemplateId, selectTemplate } = useTemplateSelection();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const themeId = event.target.value as string;
    selectTemplate(themeId, { keepUnsavedChanges: false });
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
