import { memo, useCallback } from "react";
import { ListItem, Typography, Stack } from "@mui/material";
import FontWeightOptionInput from "./FontWeightOptionInput";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useEditProperty from "../../../Design/Current/Modify/useEditProperty";

export type FontWeightOptionProps = {
  disabled?: boolean;
  name: string;
  orientation?: "horizontal" | "vertical";
  path: string;
};

export function FontWeightOption(props: FontWeightOptionProps) {
  // useEditProperty already computes the effective value (including auto-resolved)
  const { value, userEdit, isCodeControlled, reset } = useEditProperty(props.path);

  const currentValue = (value as string | number | undefined) ?? "";
  const canResetValue = !!userEdit || !!isCodeControlled;

  const handleReset = useCallback(() => reset(), [reset]);

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
        <OptionListItemResetButton canResetValue={canResetValue} resetValue={handleReset} label={"Default"} />

        <Typography variant="caption" sx={{ fontSize: 12 }}>
          {props.name}
        </Typography>
      </Stack>

      <FontWeightOptionInput
        title={props.name}
        value={String(currentValue)}
        id={`font-weight-${props.path}`}
        disabled={props.disabled || isCodeControlled}
        path={props.path}
      />
    </ListItem>
  );
}

export default memo(FontWeightOption);

