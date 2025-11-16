import { googleFontFamilyValues } from "./fontFamilyValues";
import { FormControl, Select, MenuItem } from "@mui/material";

type FontFamilyOptionInputProps = {
  id: string;
  disabled?: boolean;
  value: string;
  onChange?: (...args: any[]) => void;
};

export default function FontFamilyOptionInput(props: FontFamilyOptionInputProps) {
  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        variant="outlined"
        id={props.id}
        value={props.value}
        onChange={props.onChange}
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
