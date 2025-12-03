import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import useExport from "./useExport";
import type { ExportFileExtension } from "./useExportOptions";

const formatOptions: Array<{ label: string; value: ExportFileExtension }> = [
  {
    label: "TS",
    value: "ts",
  },
  {
    label: "JS",
    value: "js",
  },
];

function FileExtensionToggle({ sx }: { sx?: object }) {
  const { fileExtension: language, setFileExtension: setLanguage } = useExport();
  return (
    <ToggleButtonGroup
      exclusive
      value={language}
      onChange={(_, value) => {
        setLanguage(value);
      }}
      sx={{ marginInlineStart: "auto !important", borderRadius: 4, ...sx }}
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

export default FileExtensionToggle;
