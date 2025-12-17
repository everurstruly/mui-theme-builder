import { FormControlLabel, Checkbox, Tooltip } from "@mui/material";
import type { ExportMode } from "./useExportOptions";

interface MergeWithDefaultsCheckboxProps {
  mode: ExportMode;
  onModeChange: (mode: ExportMode) => void;
}

export default function MergeWithDefaultsCheckbox({
  mode,
  onModeChange,
}: MergeWithDefaultsCheckboxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onModeChange(event.target.checked ? "locked" : "diff");
  };

  return (
    <Tooltip
      title="Lock your theme to MUI v7 default values for a complete, version-locked theme object"
      arrow
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={mode === "locked"}
            onChange={handleChange}
            size="small"
          />
        }
        label="Lock to MUI v7 Defaults"
        sx={{ ml: "auto" }}
      />
    </Tooltip>
  );
}
