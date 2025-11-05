import { Button, Typography, TextField, ListItem } from "@mui/material";

export type StylesInputOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
  orientation?: "horizontal" | "vertical";
};

export default function StylesInputOption(props: StylesInputOptionProps) {
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

      <TextField
        size="small"
        variant="standard"
        value={`${props.modifiedValue}`}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            width: "7ch",
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
