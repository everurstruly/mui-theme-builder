import { Typography, TextField, ListItem, Stack } from "@mui/material";
import { useThemeDesignEditValue } from "../../../ThemeDesign";
import { useState, useEffect } from "react";
import { useDebouncyEffect } from "use-debouncy";
import OptionListItemResetButton from "../../OptionListItemResetButton";

export type FontStyleFieldOptionProps = {
  name: string;
  path: string;
  templateValue: string | number;
  orientation?: "horizontal" | "vertical";
};

export default function FontStyleFieldOption(props: FontStyleFieldOptionProps) {
  const { value, hasVisualEdit, hasCodeOverride, setValue, reset } = 
    useThemeDesignEditValue(props.path);

  const currentValue = value ?? props.templateValue;
  const canResetValue = hasVisualEdit || hasCodeOverride;
  
  const [inputValue, setInputValue] = useState(String(currentValue));

  // Sync input value when currentValue changes
  useEffect(() => {
    setInputValue(String(currentValue));
  }, [currentValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);
  };

  // Apply changes with debounce for better UX (rather than onBlur)
  useDebouncyEffect(
    () => {
      if (hasCodeOverride) return;
      // Parse as number if possible, otherwise keep as string
      const numValue = Number(inputValue);
      const newValParsed: string | number = isNaN(numValue) ? inputValue : numValue;
      // Only set when value actually differs to avoid extra updates
      if (newValParsed !== currentValue) {
        setValue(newValParsed);
      }
    },
    200,
    [inputValue]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !hasCodeOverride) {
      const numValue = Number(inputValue);
      const newValParsed: string | number = isNaN(numValue) ? inputValue : numValue;
      setValue(newValParsed);
    }
  };

  // Compute width in ch units based on input length for a responsive fit
  const widthCh = Math.max(3, String(inputValue ?? "").length) + 1;

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
      <Stack direction="row" alignItems="center" spacing={0.75} flexBasis={"100%"}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={reset}
          initStateLabel={"Default"}
        />

        <Typography variant="caption" sx={{ whiteSpace: "nowrap", fontStyle: 400, fontSize: 12 }}>
          {props.name}
        </Typography>
      </Stack>

      <TextField
        size="small"
        variant="filled"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={hasCodeOverride}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            width: `${widthCh}ch`,
            fontSize: 12,
            textAlign: "center",
            paddingInline: 1,
            paddingBlock: 0.75,
          },
        }}
      />
    </ListItem>
  );
}

