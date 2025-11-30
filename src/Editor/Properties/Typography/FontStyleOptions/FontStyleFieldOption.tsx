import { Typography, TextField, ListItem, Stack } from "@mui/material";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useEditProperty from "../../../Design/Edit/useEditProperty";

export type FontStyleFieldOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

export default function FontStyleFieldOption(props: FontStyleFieldOptionProps) {
  const { value, userEdit, isCodeControlled, setValue, reset } =
    useEditProperty(props.path);

  const currentValue = value;
  const canReset = !!userEdit || !!isCodeControlled;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);
  };

  // Compute width in ch units based on input length for a responsive fit
  const widthCh = Math.max(3, String(currentValue ?? "").length) + 1;

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
      <Stack direction="row" alignItems="center" spacing={0.75} flexBasis={"100%"}>
        <OptionListItemResetButton
          canResetValue={canReset}
          resetValue={reset}
          label={currentValue === undefined ? "Auto" : "Default"}
          labelColor={currentValue === undefined ? "resolved" : "primary"}
        />

        <Typography
          variant="caption"
          sx={{ whiteSpace: "nowrap", fontStyle: 400, fontSize: 12 }}
        >
          {props.name}
        </Typography>
      </Stack>

      <TextField
        size="small"
        variant="outlined"
        value={currentValue}
        onChange={handleChange}
        disabled={isCodeControlled}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            width: `${widthCh}ch`,
            fontSize: 12,
            textAlign: "center",
            paddingInline: 1,
            paddingBlock: 0.75,
          },
        }}
      />
    </ListItem>
  );
}
