import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import type { FontWeightOptionProps } from "./FontWeightOption";

type FontWeightOptionInputProps = {
  id: string;
  title: FontWeightOptionProps["name"];
  input: FontWeightOptionProps["initValue" | "modifiedValue"];
  disabled?: boolean;
};

const fontWeightValues = [
  {
    key: "100",
    title: "Thin",
  },
  {
    key: "200",
    title: "Light",
  },
  {
    key: "300",
    title: "Normal",
  },
  {
    key: "400",
    title: "Regular",
  },
  {
    key: "500",
    title: "Medium",
  },
  {
    key: "600",
    title: "SemiBold",
  },
  {
    key: "700",
    title: "Bold",
  },
];

export default function FontWeightOptionInput(props: FontWeightOptionInputProps) {
  const [fontWeight, setFontWeight] = React.useState(props.input.value);

  const handleChange = (event: SelectChangeEvent) => {
    setFontWeight(event.target.value);
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        id={props.id}
        value={fontWeight}
        onChange={handleChange}
        sx={{
          fontSize: 12,
          paddingLeft: 1.5,

          "& .MuiSelect-select": {
            padding: 0.75,
          },
        }}
      >
        <MenuItem value={props.input.value}>
          <em>{props.title}</em>
        </MenuItem>

        {fontWeightValues.map((option) => (
          <MenuItem key={option.key} value={option.key}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
