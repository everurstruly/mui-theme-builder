import { Typography, TextField, ListItem, Stack } from "@mui/material";
import OptionListItemResetButton from "../../OptionListItemResetButton";
import useEditProperty from "../../../Design/Current/Modify/useEditProperty";

export type CssStyleInputOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

export default function CssStyleInputOption(props: CssStyleInputOptionProps) {
  const { value, userEdit, isCodeControlled, setValue, reset } =
    useEditProperty(props.path);

  const displayValue = value;
  const canReset = !!userEdit || !!isCodeControlled;
  const valueIsDynamicallyCalculated = typeof displayValue === "function";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    if (newValue === "") {
      setValue(undefined);
    } else {
      setValue(newValue);
    }
  };

  const handleReset = () => {
    reset();
  };

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
      <Stack direction="row" alignItems="center" spacing={0.75}>
        <OptionListItemResetButton
          canResetValue={canReset}
          resetValue={handleReset}
          label={valueIsDynamicallyCalculated ? "Auto" : "Default"}
          labelColor={valueIsDynamicallyCalculated ? "resolved" : "primary"}
        />

        <Typography
          variant="caption"
          sx={{
            textTransform: "capitalize",
          }}
        >
          {props.name}
        </Typography>
      </Stack>

      <TextField
        size="small"
        variant="outlined"
        value={displayValue}
        onChange={handleChange}
        disabled={isCodeControlled}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            width: "6ch", // FIXME: magic number
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
