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
    onModeChange(event.target.checked ? "merged" : "diff");
  };

  return (
    <Tooltip
      title="Merge your overrides with MUI's default values for a complete theme object"
      arrow
    >
      <FormControlLabel
        control={
          <Checkbox
            checked={mode === "merged"}
            onChange={handleChange}
            size="small"
          />
        }
        label="Merge with MUI defaults"
        sx={{ ml: "auto" }}
      />
    </Tooltip>
  );
}
