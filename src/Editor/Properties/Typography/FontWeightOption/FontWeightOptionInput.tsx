import {
  FormControl,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";
import useEditProperty from "../../../Design/Current/Modify/useEditProperty";

type FontWeightOptionInputProps = {
  id: string;
  title: string;
  value: string;
  disabled?: boolean;
  path: string;
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
  const { setValue } = useEditProperty(props.path);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(Number(event.target.value));
  };

  return (
    <FormControl variant="standard" disabled={props.disabled}>
      <Select
        autoWidth
        variant="outlined"
        id={props.id}
        value={props.value}
        onChange={handleChange}
        sx={{
          fontSize: 12,
          paddingLeft: .5,

          "& .MuiSelect-select": {
            padding: 0.875,
          },
        }}
      >
        {fontWeightValues.map((option) => (
          <MenuItem key={option.key} value={option.key}>
            {option.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

