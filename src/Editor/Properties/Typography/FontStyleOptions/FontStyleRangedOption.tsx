import { Typography, TextField, ListItem, Stack } from "@mui/material";
import SliderInput from "../../SliderInput";
import { useState, useEffect } from "react";
import { useDebouncyEffect } from "use-debouncy";
import useEdit from "../../../Design/Edit/useEdit";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignerToolEdit from "../../../Design/Edit/useDesignerToolEdit";

export type FontStyleRangedOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

export default function FontStyleRangedOption(props: FontStyleRangedOptionProps) {
  const { value, resolvedValue, hasVisualEdit, hasCodeOverride, setValue, reset } =
    useDesignerToolEdit(props.path);

  // Prefer explicit resolvedValue from the edit hook rather than grabbing
  // the entire theme here — avoids expensive theme creation and broad
  // subscriptions that cause re-renders.
  const currentValue = value ?? resolvedValue;
  const canResetValue = hasVisualEdit || hasCodeOverride;

  const [inputValue, setInputValue] = useState(String(currentValue));

  // Sync input value when currentValue changes
  useEffect(() => {
    setInputValue(String(currentValue));
  }, [currentValue]);

  // Local interactions update `inputValue` immediately; commit to the
  // shared edit store with a small debounce to avoid spamming writes while
  // the user drags the slider.
  useDebouncyEffect(
    () => {
      const num = Number(inputValue);
      if (!Number.isNaN(num)) {
        // Commit to the real store after the debounce delay. Transient
        // previews are updated immediately from the handlers below so
        // the canvas remains responsive.
        setValue(num);
      }
    },
    120,
    [inputValue]
  );

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    const val = Array.isArray(newValue) ? newValue[0] : newValue;
    const normalizedValue = val / 20; // Convert slider value back to line height
    setInputValue(String(normalizedValue));
    // Immediate transient preview for smooth live canvas updates
    const setPreview = useEdit.getState().setPreview;
    setPreview(props.path, normalizedValue);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    const num = Number(event.target.value);
    const setPreview = useEdit.getState().setPreview;
    const clearPreview = useEdit.getState().clearPreview;
    if (!Number.isNaN(num)) setPreview(props.path, num);
    else clearPreview(props.path);
  };

  const handleBlur = () => {
    const numValue = Number(inputValue);
    if (Number.isNaN(numValue)) return;
    // commit immediately on blur
    setValue(numValue);
    const clearPreview = useEdit.getState().clearPreview;
    clearPreview(props.path);
  };

  const handleSliderCommit = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const v = Array.isArray(newValue) ? newValue[0] : newValue;
    const normalized = v / 20;
    setValue(normalized);
    const clearPreview = useEdit.getState().clearPreview;
    clearPreview(props.path);
  };

  // Ensure we clear any transient preview if this component unmounts
  useEffect(() => {
    return () => {
      const clearPreview = useEdit.getState().clearPreview;
      clearPreview(props.path);
    };
  }, [props.path]);

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
        value={parseFloat(String(inputValue || currentValue)) * 20}
        arialLabel={props.name}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommit}
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
