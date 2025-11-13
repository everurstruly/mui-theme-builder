import { googleFontFamilyValues } from "./fontFamilyValues";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import { useThemeDesignEditValue, useThemeDesignStore } from "../../../ThemeDesign";

type FontFamilyOptionInputProps = {
  id: string;
  disabled?: boolean;
  value: string;
  path: string;
};

export default function FontFamilyOptionInput(props: FontFamilyOptionInputProps) {
  const { setValue } = useThemeDesignEditValue(props.path);
  const setVisualEdit = useThemeDesignStore((s) => s.setVisualEdit);

  // Extract primary font from full fontFamily string (e.g., "Roboto", "Helvetica", "Arial", sans-serif -> Roboto)
  const extractPrimaryFont = (fontFamily: string): string => {
    const match = fontFamily.match(/^['"]?([^'"\,]+)['"]?/);
    return match ? match[1].trim() : fontFamily;
  };

  const primaryFont = extractPrimaryFont(props.value);

  const handleChange = (event: SelectChangeEvent) => {
    const selectedFont = event.target.value;
    // Build proper CSS font-family value with fallbacks
    const fontFamilyValue = selectedFont.includes(' ') 
      ? `"${selectedFont}", sans-serif`
      : `${selectedFont}, sans-serif`;
    // If this input was wired to the H1 path for "Headings", also apply
    // the same font-family to all heading variants H1..H6 so the control
    // acts as a single "Headings" font selector.
    if (props.path === 'typography.h1.fontFamily') {
      const headingPaths = [
        'typography.h1.fontFamily',
        'typography.h2.fontFamily',
        'typography.h3.fontFamily',
        'typography.h4.fontFamily',
        'typography.h5.fontFamily',
        'typography.h6.fontFamily',
      ];
      headingPaths.forEach((p) => setVisualEdit(p, fontFamilyValue));
      return;
    }

    setValue(fontFamilyValue);
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        variant="filled"
        id={props.id}
        value={primaryFont}
        onChange={handleChange}
        sx={{
          fontSize: 12,
          paddingLeft: .5,

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

