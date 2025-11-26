import { ListItem, Typography, Stack } from "@mui/material";
import FontWeightOptionInput from "./FontWeightOptionInput";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useDesignCreatedTheme from "../../../Design/Current/useCreatedTheme";
import useEditWithDesignTool from "../../../Design/Current/useEditWithDesignTool";
import { getNestedValue } from "../../../Design/compiler";

export type FontWeightOptionProps = {
  disabled?: boolean;
  name: string;
  orientation?: "horizontal" | "vertical";
  path: string;
};

export default function FontWeightOption(props: FontWeightOptionProps) {
  const theme = useDesignCreatedTheme();
  const autoResolvedValue = getNestedValue(theme, props.path);
  
  const { value, hasVisualEdit, hasCodeOverride, reset } = 
    useEditWithDesignTool(props.path);

  const currentValue = (value as string | number) ?? autoResolvedValue;
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

