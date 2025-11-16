import { googleFontFamilyValues } from "./fontFamilyValues";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { useThemeDesignEditValue, useThemeDesignStore } from "../../../Design";

type FontFamilyOptionInputProps = {
  id: string;
  disabled?: boolean;
  value: string;
  path: string;
};

const headingPaths = [
  "typography.h1.fontFamily",
  "typography.h2.fontFamily",
  "typography.h3.fontFamily",
  "typography.h4.fontFamily",
  "typography.h5.fontFamily",
  "typography.h6.fontFamily",
];

export default function FontFamilyOptionInput(props: FontFamilyOptionInputProps) {
  const primaryFont = extractPrimaryFont(props.value);
  const setVisualEdit = useThemeDesignStore((s) => s.addDesignToolEdit);
  const { setValue } = useThemeDesignEditValue(props.path);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedFont = event.target.value;
    // Build proper CSS font-family value with fallbacks
    const fontFamilyValue = selectedFont.includes(" ")
      ? `"${selectedFont}", sans-serif`
      : `${selectedFont}, sans-serif`;

    if (props.path === "typography.h1.fontFamily") {
      headingPaths.forEach((p) => setVisualEdit(p, fontFamilyValue));
    } else {
      setValue(fontFamilyValue);
    }
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        variant="outlined"
        id={props.id}
        value={primaryFont}
        onChange={handleChange}
        sx={{
          fontSize: 12,
          paddingLeft: 0.5,

          "& .MuiSelect-select": {
            padding: 0.875,
          },
        }}
      >
        {googleFontFamilyValues.map((font) => (
          <MenuItem key={font.key} value={font.key}>
            {font.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

// Extract primary font from full fontFamily string (e.g., "Roboto", "Helvetica", "Arial", sans-serif -> Roboto)
function extractPrimaryFont(fontFamily: string): string {
  const match = fontFamily.match(/^['"]?([^'",]+)['"]?/);
  return match ? match[1].trim() : fontFamily;
}
