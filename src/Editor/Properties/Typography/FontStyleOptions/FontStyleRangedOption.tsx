import { Typography, TextField, ListItem, Stack } from "@mui/material";
import SliderInput from "../../SliderInput";
import { useState, useEffect } from "react";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignCreatedTheme from "../../../Design/Current/useCreatedTheme";
import useEditWithDesignTool from "../../../Design/Current/useEditWithDesignTool";
import { getNestedValue } from "../../../Design/compiler";

export type FontStyleRangedOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

export default function FontStyleRangedOption(props: FontStyleRangedOptionProps) {
  const theme = useDesignCreatedTheme();
  const autoResolvedValue = getNestedValue(theme, props.path);

  const { value, hasVisualEdit, hasCodeOverride, setValue, reset } =
    useEditWithDesignTool(props.path);

  const currentValue = value ?? autoResolvedValue;
  const canResetValue = hasVisualEdit || hasCodeOverride;

  const [inputValue, setInputValue] = useState(String(currentValue));

  // Sync input value when currentValue changes
  useEffect(() => {
    setInputValue(String(currentValue));
  }, [currentValue]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    const normalizedValue = val / 20; // Convert slider value back to line height
    setValue(normalizedValue);
    setInputValue(String(normalizedValue));
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleBlur = () => {
    const numValue = Number(inputValue);
    setValue(isNaN(numValue) ? inputValue : numValue);
  };

  return (
    <ListItem
      component="div"
      sx={{
        width: "auto",
        paddingInline: 0,
        justifyContent: "space-between",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        flexDirection: props.orientation === "vertical" ? "column" : "row",
        gap: props.orientation === "vertical" ? 1 : 0,
        paddingBlock: 0.75,
        columnGap: 2.5,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={reset}
          label={"Default"}
        />

        <Typography variant="caption" sx={{ fontStyle: 400, fontSize: 12, whiteSpace: "nowrap" }}>
          {props.name}
        </Typography>
      </Stack>

      <SliderInput
        defaultValue={parseFloat(String(currentValue)) * 20}
        arialLabel={props.name}
        onChange={handleSliderChange}
        disabled={hasCodeOverride}
      />

      <TextField
        size="small"
        variant="outlined"
        value={inputValue}
        onChange={handleTextChange}
        onBlur={handleBlur}
        disabled={hasCodeOverride}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            minWidth: "6ch",
            fontSize: 12,
            textAlign: "center",
            paddingInline: 0,
            paddingBlock: 0.75,
          },
        }}
      />
    </ListItem>
  );
}
