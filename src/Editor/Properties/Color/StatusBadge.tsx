import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material";

type StatusBadgeProps = {
  label: string;
  kind?: "resolved" | "primary" | undefined;
  sx?: SxProps<Theme>;
};

export default function StatusBadge({ label, kind, sx }: StatusBadgeProps) {
  const theme = useTheme();

  const base: SxProps<Theme> = {
    p: 0.5,
    fontSize: 10,
    lineHeight: 1,
    minWidth: "7ch",
    textAlign: "center",
    backgroundColor: "#e0f8e089",
  };

  const kindSx: SxProps<Theme> = (() => {
    if (kind === "resolved") {
      return theme.palette.mode === "dark"
        ? { color: "#b085ff", backgroundColor: "#2a0b5f" }
        : { color: "#7c4dff", backgroundColor: "#1002352f" };
    }

    if (kind === "primary") {
      return { color: theme.palette.primary.main };
    }

    return {};
  })();

  return (
    <Typography sx={[base, kindSx, sx] as SxProps<Theme>}>{label}</Typography>
  );
}
