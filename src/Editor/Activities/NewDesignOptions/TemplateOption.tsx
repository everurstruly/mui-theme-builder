import * as React from "react";
import { Box, Button, FormControl, MenuItem, Select, Typography, FormControlLabel, Switch } from "@mui/material";
import {
  useThemeDesignStore,
  listThemeTemplateIds,
  THEME_TEMPLATE_METADATA,
  type ThemeTemplateId,
} from "../../Design";

export default function TemplateOption({ onClose }: { onClose: () => void }) {
  const selected = useThemeDesignStore((s) => s.selectedTemplateId.id) as ThemeTemplateId;
  const switchTemplate = useThemeDesignStore((s) => s.switchTemplate);
  const [keepEdits, setKeepEdits] = React.useState(true);

  const handleCreate = () => {
    switchTemplate({ type: "builtin", id: selected }, !keepEdits);
    onClose();
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl size="small">
        <Select value={selected} onChange={(e) => {
          /* delegate to store via switchTemplate when creating */
        }}>
          {listThemeTemplateIds().map((id) => (
            <MenuItem key={id} value={id}>{THEME_TEMPLATE_METADATA[id]?.label || id}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControlLabel
        control={<Switch checked={keepEdits} onChange={(_, v) => setKeepEdits(v)} />}
        label="Keep current edits"
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" onClick={handleCreate}>Create from template</Button>
        <Button variant="outlined" onClick={onClose}>Cancel</Button>
      </Box>
    </Box>
  );
}
