import { Button, Typography, TextField, ListItem } from "@mui/material";
import SliderInput from "../../SliderInput";

export type FontStyleRangedOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
  orientation?: "horizontal" | "vertical";
};

export default function FontStyleRangedOption(props: FontStyleRangedOptionProps) {
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
          fontStyle: 400,
          fontSize: 12,
          textWrap: "nowrap",
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

      <SliderInput
        defaultValue={parseFloat(props.modifiedValue) * 20}
        arialLabel={props.name}
      />

      <TextField
        size="small"
        variant="filled"
        value={`${props.modifiedValue}`}
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

