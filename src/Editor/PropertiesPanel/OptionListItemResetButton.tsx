import { Button, Typography } from "@mui/material";
import type { Theme } from "@mui/material";

type OptionListItemResetButtonProps = {
  canResetValue: boolean;
  resetValue: () => void;
  label?: string;
  labelColor?: string;
};

const baseLabelSx = {
  p: 0.5,
  fontSize: 10,
  lineHeight: 1,
  minWidth: "7ch", // matches previous visual width
  textAlign: "center",
  fontWeight: 500,
};

function labelColorOverride(theme: Theme, labelColor?: string) {
  const isDarkMode = theme.palette.mode === "dark";

  if (labelColor === "resolved") {
    return isDarkMode
      ? { color: "violet", backgroundColor: "#232127ff" }
      : { color: "purple", backgroundColor: "#f0ecfcff" };
  }

  return isDarkMode
    ? { color: "limegreen", backgroundColor: "#112d1189" }
    : { color: "forestgreen", backgroundColor: "#e0f8e089" };
}

function OptionListItemResetButton(props: OptionListItemResetButtonProps) {
  const { canResetValue, resetValue, label: initStateLabel, labelColor } = props;

  if (!canResetValue) {
    return (
      <Typography
        sx={[baseLabelSx, (theme: Theme) => labelColorOverride(theme, labelColor)]}
      >
        {initStateLabel ?? "Default"}
      </Typography>
    );
  }

  return (
    <Button
      color="warning"
      onClick={() => resetValue()}
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
  );
}

export default OptionListItemResetButton;
