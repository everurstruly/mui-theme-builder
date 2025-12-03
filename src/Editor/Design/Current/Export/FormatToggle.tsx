import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import useExport from "./useExport";
import type { ExportLanguage } from "./useExportOptions";

const formatOptions: Array<{ label: string; value: ExportLanguage }> = [
  {
    label: "TS",
    value: "ts",
  },
  {
    label: "JS",
    value: "js",
  },
];

function FormatToggle() {
  const { language, setLanguage } = useExport();
  return (
    <ToggleButtonGroup
      exclusive
      value={language}
      onChange={(_, value) => {
        setLanguage(value);
      }}
      sx={{ marginInlineStart: "auto !important", borderRadius: 4 }}
    >
      {formatOptions.map((option) => {
        return (
          <ToggleButton sx={{ lineHeight: 1, p: 1 }} value={option.value}>
            {option.label}
          </ToggleButton>
        );
      })}
    </ToggleButtonGroup>
  );
}

export default FormatToggle;
