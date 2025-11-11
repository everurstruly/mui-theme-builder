import { Button, Typography } from "@mui/material";

type OptionListItemResetButtonProps = {
  canResetValue: boolean;
  resetValue: () => void;
  initStateLabel?: string;
};

function OptionListItemResetButton(props: OptionListItemResetButtonProps) {
  if (!props.canResetValue) {
    return (
      <Typography
        color="green"
        sx={[
          () => ({
            p: 0.5,
            fontSize: 10,
            lineHeight: 1,
            backgroundColor: "#e0f8e089",
          }),
          (theme) =>
            theme.applyStyles("dark", {
              color: "limegreen",
              backgroundColor: "#1a3e1a89",
            }),
        ]}
      >
        {props.initStateLabel ?? "Default"}
      </Typography>
    );
  }

  return (
    <Button
      color="warning"
      onClick={() => props.resetValue()}
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
