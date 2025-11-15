import { ListItem, Typography, Stack } from "@mui/material";
import FontWeightOptionInput from "./FontWeightOptionInput";
import { useThemeDesignEditValue } from "../../../ThemeDesign";
import OptionListItemResetButton from "../../OptionListItemResetButton";

export type FontWeightOptionProps = {
  disabled?: boolean;
  name: string;
  orientation?: "horizontal" | "vertical";
  path: string;
  templateValue: string | number;
};

export default function FontWeightOption(props: FontWeightOptionProps) {
  const { value, hasVisualEdit, hasCodeOverride, reset } = 
    useThemeDesignEditValue(props.path);

  const currentValue = (value as string | number) ?? props.templateValue;
  const canResetValue = hasVisualEdit || hasCodeOverride;

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 0,
        justifyContent: "space-between",
        alignItems: props.orientation === "vertical" ? "start" : "center",
        display: "flex",
        flexDirection: props.orientation === "vertical" ? "column" : "row",
        gap: props.orientation === "vertical" ? 1 : 2,
        paddingBlock: 0.75,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={reset}
          label={"Default"}
        />

        <Typography variant="caption" sx={{ fontSize: 12 }}>
          {props.name}
        </Typography>
      </Stack>

      <FontWeightOptionInput
        title={props.name}
        value={String(currentValue)}
        id={`font-weight-${props.path}`}
        disabled={props.disabled || hasCodeOverride}
        path={props.path}
      />
    </ListItem>
  );
}

