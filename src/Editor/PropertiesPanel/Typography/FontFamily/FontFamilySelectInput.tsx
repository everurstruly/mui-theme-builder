import React from "react";
import { googleFontOptions } from "./family";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import type { FontFamilySelectOptionProps } from "./FontFamilySelectOption";

type FontFamilySelectInputProps = {
  id: string;
  disabled?: boolean;
  value: FontFamilySelectOptionProps["initValue" | "modifiedValue"];
};

export default function FontFamilySelectInput(props: FontFamilySelectInputProps) {
  const [fontType, setFontType] = React.useState(props.value.key);

  const handleChange = (event: SelectChangeEvent) => {
    setFontType(event.target.value);
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        id={props.id}
        value={fontType}
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

        {googleFontOptions.map((font) => (
          <MenuItem key={font.key} value={font.key}>
            {font.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
