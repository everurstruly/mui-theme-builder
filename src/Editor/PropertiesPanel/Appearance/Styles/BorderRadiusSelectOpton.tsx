import { Button, Typography, ListItem } from "@mui/material";
import BorderRadiusSelect from "./BorderRadiusSelect";

export type BorderRadiusSelectOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
  orientation?: "horizontal" | "vertical";
};

export default function BorderRadiusSelectOption(
  props: BorderRadiusSelectOptionProps
) {
  const canResetValue = props.initValue !== props.modifiedValue;

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
      <Typography
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 0.5,
          fontSize: 12,
          textWrap: "nowrap",
          color: canResetValue ? "warning.main" : "text.primary",
        }}
      >
        {/* {!canResetValue && (
          <Typography
            color="green"
            sx={{
              backgroundColor: "#e0f8e089",
              fontSize: 10,
              paddingInline: 0.75,
              paddingBlock: 0.75,
              lineHeight: 1,
            }}
          >
            Default
          </Typography>
        )} */}

        {props.name}

        {canResetValue && (
          <Button
            sx={{
              lineHeight: 1,
              minWidth: "auto",
            }}
          >
            Reset
          </Button>
        )}
      </Typography>

      <BorderRadiusSelect />
    </ListItem>
  );
}
