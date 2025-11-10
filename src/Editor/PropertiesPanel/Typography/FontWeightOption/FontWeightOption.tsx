import { Button, ListItem, Typography } from "@mui/material";
import FontWeightOptionInput from "./FontWeightOptionInput";

export type FontWeightOptionProps = {
  disabled?: boolean;
  name: string;
  orientation?: "horizontal" | "vertical";
  initValue: {
    value: string;
  };
  modifiedValue: {
    value: string;
  };
};

export default function FontWeightOption(props: FontWeightOptionProps) {
  const canResetValue = props.initValue.value !== props.modifiedValue.value;

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
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.5,
          fontSize: 12,
          // color: canResetValue ? "warning.main" : "text.primary",
        }}
      >
        {!canResetValue && (
          <Typography
            color="green"
            sx={{
              p: 0.5,
              fontSize: 10,
              lineHeight: 1,
              backgroundColor: "#e0f8e089",
            }}
          >
            Default
          </Typography>
        )}

        {canResetValue && (
          <Button
            color="warning"
            sx={{
              lineHeight: 1,
              fontSize: 10,
              padding: 0.5,
              fontWeight: 400,
              minWidth: "auto",
            }}
          >
            Reset
          </Button>
        )}

        {props.name}
      </Typography>

      <FontWeightOptionInput
        title={props.name}
        input={props.initValue}
        id={props.initValue.value}
        disabled={props.disabled}
      />
    </ListItem>
  );
}

