import { Typography, TextField, ListItem, Stack } from "@mui/material";
import { useState } from "react";
import SliderInput from "../../SliderInput";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignerToolEdit from "../../../Design/Edit/useDesignerToolEdit";

export type FontStyleRangedOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

const ratioToPxMultiplier = 20;

export default function FontStyleRangedOption(props: FontStyleRangedOptionProps) {
  const {
    value: effectiveValue,
    resolvedValue,
    hasCodeOverride,
    setValue,
    reset,
    canReset,
  } = useDesignerToolEdit(props.path);

  // Initialize the input from the effective value, falling back to the
  // resolved/template value and then a sensible default of "1".
  const initialInput = String(effectiveValue ?? resolvedValue ?? "1");
  const [inputHtmlRatioValue, setInputHtmlRatioValue] = useState(initialInput);

  const sliderValue = Math.round(
    parseFloat(inputHtmlRatioValue || "1") * ratioToPxMultiplier
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (isNaN(Number(value))) {
      return;
    }

    // Update transient UI state and write immediately for live preview
    setInputHtmlRatioValue(value);
    setValue(value);
  };

  function handleInputBlur() {
    if (inputHtmlRatioValue === "" || isNaN(Number(inputHtmlRatioValue))) {
      return reset();
    }

    setValue(inputHtmlRatioValue);
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    const val = calcInputValueFromSliderValue(newValue);
    const valStr = String(val);
    setInputHtmlRatioValue(valStr);
    // live update for direct preview
    setValue(val);
  };

  const handleSliderCommit = (_: any, newValue: number | number[]) => {
    setValue(calcInputValueFromSliderValue(newValue));
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
          canResetValue={canReset}
          resetValue={reset}
          label={"Default"}
        />

        <Typography
          variant="caption"
          sx={{ fontStyle: 400, fontSize: 12, whiteSpace: "nowrap" }}
        >
          {props.name}
        </Typography>
      </Stack>

      <SliderInput
        value={sliderValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommit}
        disabled={hasCodeOverride}
      />

      <TextField
        size="small"
        variant="outlined"
        value={inputHtmlRatioValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
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

function calcInputValueFromSliderValue(value: number | number[]) {
  const valPx = Array.isArray(value) ? value[0] : value;
  return valPx / ratioToPxMultiplier;
}
