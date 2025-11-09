import React from "react";
import { googleFontFamilyValues } from "./fontFamilyValues";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import type { FontFamilyOptionProps } from "./FontFamilyOption";

type FontFamilyOptionInputProps = {
  id: string;
  disabled?: boolean;
  value: FontFamilyOptionProps["initValue" | "modifiedValue"];
};

export default function FontFamilyOptionInput(props: FontFamilyOptionInputProps) {
  const [value, setValue] = React.useState(props.value.key);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value);
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        id={props.id}
        value={value}
        onChange={handleChange}
        sx={{
          fontSize: 12,
          paddingLeft: 2,

          "& .MuiSelect-select": {
            padding: 1,
          },
        }}
      >
        <MenuItem value={props.value.key}>
          <em>{props.value.title}</em>
        </MenuItem>

        {googleFontFamilyValues.map((font) => (
          <MenuItem key={font.key} value={font.key}>
            {font.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
