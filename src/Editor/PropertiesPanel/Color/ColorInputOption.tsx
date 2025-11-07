import {
  Button,
  Typography,
  TextField,
  ListItem,
  Box,
  Tooltip,
} from "@mui/material";
import { useThemeValue } from "../../ThemeWorkspace";

export type StylesInputOptionProps = {
  name: string;
  path: string;
  resolvedValue: string | number;
  orientation?: "horizontal" | "vertical";
};

export default function ColorInputOption(props: StylesInputOptionProps) {
  const { value, setValue, isUserEditted, resetToBase, shouldBeEditedWithCode } =
    useThemeValue(props.path);

  const currentValue = (value as string | number) ?? props.resolvedValue;
  const canResetValue = isUserEditted;

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
        columnGap: 1,
      }}
    >
      <Typography
        component="div"
        variant="caption"
        sx={{
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
          columnGap: 0.75,
          // color: canResetValue ? "warning.main" : "text.primary",
          cursor: "pointer",
          fontWeight: 400,
          textTransform: "capitalize",
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
            onClick={() => resetToBase()}
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

      <Tooltip title={"Action shade color intensity"}>
        <TextField
          size="small"
          value={String(currentValue)}
          onChange={(e) => setValue(e.target.value)}
          disabled={shouldBeEditedWithCode}
          sx={{
            flexBasis: props.orientation === "vertical" ? "100%" : "auto",

            minHeight: 0,
            height: "fit-content",
            paddingBlock: 0,

            "& .MuiInputBase-input": {
              maxWidth: "8ch",
              fontSize: "caption.fontSize",
              textAlign: "center",
              paddingInline: 0,
              paddingBlock: 0.5,
            },
          }}
        />
      </Tooltip>

      <Box
        sx={{
          width: 32,
          height: 20,
          bgcolor: `rgba(0, 0, 0, ${currentValue})`,
          borderRadius: 1,
          border: 2,
          borderColor: "divider",
          cursor: shouldBeEditedWithCode ? "not-allowed" : "pointer",
          display: "inline-block",
          opacity: shouldBeEditedWithCode ? 0.5 : 1,
        }}
      />
    </ListItem>
  );
}
