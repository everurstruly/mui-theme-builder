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
  const { resolvedValue, hasCodeOverride, setValue, reset, canReset } =
    useDesignerToolEdit(props.path);

  const [inputHtmlRatioValue, setInputHtmlRatioValue] = useState(resolvedValue);
  const sliderValue = Math.round(
    parseFloat(inputHtmlRatioValue) * ratioToPxMultiplier
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (isNaN(Number(value))) {
      return;
    }

    setInputHtmlRatioValue(value);
  };

  function handleInputBlur() {
    if (inputHtmlRatioValue === "" || isNaN(Number(inputHtmlRatioValue))) {
      return reset();
    }

    setValue(inputHtmlRatioValue);
  }

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    setInputHtmlRatioValue(calcInputValueFromSliderValue(newValue));
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
