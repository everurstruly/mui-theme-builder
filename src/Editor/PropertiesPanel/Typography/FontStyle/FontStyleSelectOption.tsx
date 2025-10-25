import { Button, Typography, TextField, ListItem } from "@mui/material";

export type FontStyleSelectOptionProps = {
  name: string;
  initValue: string;
  modifiedValue: string;
};

export default function FontStyleSelectOption(
  props: FontStyleSelectOptionProps
) {
  const canResetValue = props.initValue !== props.modifiedValue;

  return (
    <ListItem
      component="div"
      sx={{
        width: "auto",
        paddingInline: 1,
        justifyContent: "space-between",
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "end",
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

      <TextField
        size="small"
        variant="filled"
        value={props.modifiedValue}
        sx={{
          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            paddingTop: 1.5,
            width: "5ch",
            fontSize: 12,
            textAlign: "center",
            marginRight: 1,
            paddingRight: 1,
          },
        }}
      />
    </ListItem>
  );
}
