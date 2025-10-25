import { Button, ListItem, Typography } from "@mui/material";
import FontFamilySelectInput from "./FontFamilySelectInput";

export type FontFamilySelectOptionProps = {
  name: string;
  initValue: {
    key: string;
    title: string;
  };
  modifiedValue: {
    key: string;
    title: string;
  };
};

export default function FontFamilySelectOption(
  props: FontFamilySelectOptionProps
) {
  const canResetValue = props.initValue.key !== props.modifiedValue.key;

  return (
    <ListItem
      sx={{
        width: "auto",
        paddingInline: 1,
        justifyContent: "space-between",
      }}
    >
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.75,
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
              paddingInline: 0.625,
              paddingBlock: 0.5,
              borderRadius: 1,
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

      <FontFamilySelectInput
        id={`font-family-select-${props.name}`}
        value={props.modifiedValue}
      />
    </ListItem>
  );
}
