import { Typography, TextField, ListItem, Stack } from "@mui/material";
import { useThemeDesignEditValue } from "../../../ThemeDesign";
import OptionListItemResetButton from "../../OptionListItemResetButton";

export type CssStyleInputOptionProps = {
  name: string;
  path: string;
  orientation?: "horizontal" | "vertical";
};

export default function CssStyleInputOption(props: CssStyleInputOptionProps) {
  const { value, setValue, reset, hasVisualEdit, hasCodeOverride } =
    useThemeDesignEditValue(props.path);

  const displayValue = value?.toString() ?? "";
  const canResetValue = hasVisualEdit || hasCodeOverride;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    // Parse as number for numeric paths (spacing, shape.borderRadius)
    if (props.path === "spacing" || props.path === "shape.borderRadius") {
      const numValue = Number(newValue);
      if (!isNaN(numValue)) {
        setValue(numValue);
      }
    } else {
      // For other paths that might need strings (like '4px')
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
          canResetValue={canResetValue}
          resetValue={handleReset}
          label="Default"
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
        variant="filled"
        value={displayValue}
        onChange={handleChange}
        disabled={hasCodeOverride}
        sx={{
          flexBasis: props.orientation === "vertical" ? "100%" : "auto",

          minHeight: 0,
          height: "fit-content",
          paddingBlock: 0,

          "& .MuiInputBase-input": {
            width: "5ch", // FIXME: magic number
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
