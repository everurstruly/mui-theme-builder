import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import useExport from "./useExport";
import { fileSelectOptions } from "./fileSelectOptions";
import type { ExportColorScheme } from "./useExportOptions";

export default function FileSelectBox() {
  const { colorScheme, setColorScheme } = useExport();
  const selection = fileSelectOptions.find((option) => option.value === colorScheme);

  const handleChange = (event: SelectChangeEvent) => {
    setColorScheme(event.target.value as ExportColorScheme);
  };

  return (
    <Select
      value={selection?.value || ""}
      onChange={handleChange}
      IconComponent={ExpandMoreIcon}
      // Minimal, borderless, Apple-like appearance
      sx={{
        flexGrow: 1,
        minWidth: 140,
        bgcolor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
        borderRadius: 2,
        px: 1,
        py: 0.4,
        fontWeight: 600,
        textTransform: "none",
        // remove default borders/underlines
        ".MuiOutlinedInput-notchedOutline": { border: "none" },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
        // hide underline for standard/filled variants
        '& .MuiInputBase-root:before, & .MuiInputBase-root:after': { display: "none" },
        // icon placement and look
        '& .MuiSelect-icon': {
          right: 10,
          color: "text.secondary",
          fontSize: "1rem",
        },
      }}
      // style the dropdown paper to match the minimal aesthetic
      MenuProps={{
        PaperProps: {
          elevation: 8,
          sx: {
            borderRadius: 2,
            minWidth: 160,
            px: 0.5,
            py: 0.25,
            // subtle shadow and backdrop
            boxShadow: (theme) => theme.shadows?.[6] ?? "0 10px 30px rgba(0,0,0,0.12)",
          },
        },
      }}
    >
      {fileSelectOptions.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{
            borderRadius: 1,
            py: 0.6,
            px: 1,
            fontWeight: 600,
            textTransform: "none",
          }}
        >
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}
