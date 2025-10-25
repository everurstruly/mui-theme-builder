import { Button, ListItem, Typography } from "@mui/material";
import FontWeightSelectInput from "./FontWeightSelectInput";

export type FontWeightSelectOptionProps = {
  name: string;
  initValue: {
    value: string;
    title: string;
  };
  modifiedValue: {
    value: string;
    title: string;
  };
};

export default function FontWeightSelectOption(
  props: FontWeightSelectOptionProps
) {
  const canResetValue = props.initValue.value !== props.modifiedValue.value;

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 1,
        justifyContent: "space-between",
        alignItems: "end",
      }}
    >
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.5,
          fontWeight: 400,
          fontSize: 12,
          color: "#555",
          textTransform: "capitalize",
        }}
      >
        {!canResetValue && (
          <Typography
            color="green"
            sx={{
              backgroundColor: "#e0f8e0b7",
              paddingInline: 0.5,
              paddingBlock: 0.35,
              fontSize: 10,
            }}
          >
            Default
          </Typography>
        )}

        {canResetValue && (
          <Button
            sx={{
              fontSize: 10,
              paddingInline: 0.5,
              paddingBlock: 0.5,
              minWidth: "auto",
              textTransform: "none",
            }}
          >
            Reset
          </Button>
        )}

        {props.name}
      </Typography>

      <FontWeightSelectInput
        value={props.initValue.value}
        title={props.initValue.title}
      />
    </ListItem>
  );
}
