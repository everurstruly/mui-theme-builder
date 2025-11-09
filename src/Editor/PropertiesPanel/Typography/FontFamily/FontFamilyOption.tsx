import { Button, ListItem, Typography } from "@mui/material";
import FontFamilyOptionInput from "./FontFamilyOptionInput";

export type FontFamilyOptionProps = {
  name: string;
  initValue: {
    key: string;
    title: string;
  };
  modifiedValue: {
    key: string;
    title: string;
  };
  disabled?: boolean;
};

export default function FontFamilyOption(props: FontFamilyOptionProps) {
  const canResetValue = props.initValue.key !== props.modifiedValue.key;

  function getColor() {
    if (props.disabled) {
      return "text.disabled";
    }

    if (canResetValue) {
      return "warning.main";
    }

    return "text.primary";
  }

  return (
    <ListItem
      sx={{
        width: "auto",
        justifyContent: "space-between",
        paddingInline: 0,
        paddingBlock: 0.75,
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
          color: getColor(),
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
        {/* 
        {canResetValue && (
          <Button
            sx={{
              marginLeft: 1,
              backgroundColor: "rgba(137, 194, 244, 0.2)",
              fontSize: 10,
              lineHeight: 1,
              paddingInline: 0.75,
              paddingBlock: 0.5,
              minWidth: "auto",
              textTransform: "none",
            }}
          >
            Reset
          </Button>
        )} */}
      </Typography>

      <FontFamilyOptionInput
        id={`font-family-select-${props.name}`}
        value={props.modifiedValue}
        disabled={props.disabled}
      />
    </ListItem>
  );
}
