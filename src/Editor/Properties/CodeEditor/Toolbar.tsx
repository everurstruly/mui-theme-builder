import { PlayArrowRounded, RestartAltRounded } from "@mui/icons-material";
import { Stack, Button, IconButton, Tooltip } from "@mui/material";
import { Link } from "react-router";

type ToolbarProps = {
  onApply: () => void;
  onDiscard: () => void;
  onClear: () => void;
  hasUnsaved: boolean;
  hasOverrides: boolean;
};

export default function Toolbar(props: ToolbarProps) {
  const { onApply, onClear, hasUnsaved, hasOverrides } = props;
  return (
    <Stack
      direction="row"
      px={1.5}
      columnGap={1}
      alignItems="center"
      py={1}
      minHeight={"var(--activity-bar-height)"}
    >
      <Button
        component={Link}
        to="https://mui.com/material-ui/guides/building-extensible-themes/"
        size="small"
        target="_blank"
        rel="noopener noreferrer"
        sx={{ paddingInlineEnd: 1, minWidth: 0 }}
      >
        Docs
      </Button>

      <Stack
        direction="row"
        alignItems={"center"}
        marginInlineStart={"auto"}
        columnGap={1}
      >
        <Tooltip title="Apply code overrides">
          <span style={{ display: "inline-block" }}>
            <IconButton size="small" onClick={onApply} disabled={!hasUnsaved}>
              <PlayArrowRounded />
            </IconButton>
          </span>
        </Tooltip>

        <Tooltip title="Clear all code overrides">
          <span style={{ display: "inline-block" }}>
            <IconButton
              size="small"
              color="error"
              onClick={onClear}
              disabled={!hasOverrides}
            >
              <RestartAltRounded />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
