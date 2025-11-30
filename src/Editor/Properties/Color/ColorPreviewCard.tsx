import { Box, Card, Button, alpha } from "@mui/material";
import {
  PaletteOutlined,
  ViewCompact,
  FormatColorFillRounded,
} from "@mui/icons-material";

type Props = {
  previewBackground?: string | undefined;
  previewForeground?: string | undefined;
  previewForegroundReadable?: string | undefined;
  hasForeground?: boolean;
  onForegroundClick?: () => void;
  onBackgroundClick?: () => void;
  foregroundAnchorRef?: React.RefObject<HTMLDivElement | null>;
  backgroundAnchorRef?: React.RefObject<HTMLDivElement | null>;
  foregroundDisabled?: boolean;
  backgroundDisabled?: boolean;
  /** Optional content rendered in the card bottom-left (e.g. States button) */
  /** Render a small labeled States button inside the card */
  showStates?: boolean;
  onOpenShades?: () => void;
};

export default function ColorPreviewCard({
  previewBackground,
  previewForeground,
  previewForegroundReadable,
  hasForeground,
  onForegroundClick,
  onBackgroundClick,
  foregroundAnchorRef,
  backgroundAnchorRef,
  foregroundDisabled,
  backgroundDisabled,
  showStates,
  onOpenShades,
}: Props) {
  return (
    <Card
      elevation={0}
      sx={{
        position: "relative",
        width: "100%",
        height: 116,
        borderRadius: 4,
        border: 4,
        borderColor: "divider",
        backgroundColor: previewBackground,
      }}
    >
      <Box
        ref={foregroundAnchorRef}
        onClick={onForegroundClick}
        component={Button}
        sx={{
          display: hasForeground ? undefined : "none",
          cursor: foregroundDisabled ? "not-allowed" : "pointer",
          opacity: foregroundDisabled ? 0.5 : 1,
          color: previewForeground,
          backgroundColor: previewForegroundReadable
            ? alpha(previewForegroundReadable, 0.05)
            : undefined,
          position: "absolute",
          top: 0,
          left: 0,
          columnGap: 0.5,
          rowGap: 0.2,
        }}
      >
        <FormatColorFillRounded fontSize="small" /> On color
      </Box>

      <Box
        ref={backgroundAnchorRef}
        onClick={onBackgroundClick}
        component={Button}
        color="primary"
        sx={{
          cursor: backgroundDisabled ? "not-allowed" : "pointer",
          opacity: backgroundDisabled ? 0.5 : 1,
          color: previewForegroundReadable,
          backgroundColor: previewForegroundReadable
            ? alpha(previewForegroundReadable, 0.07)
            : undefined,
          position: "absolute",
          minWidth: "auto",
          alignItems: "flex-end",
          justifyContent: "center",
          top: "50%",
          bottom: 0,
          right: 0,
          pl: 1.4,
        }}
      >
        <PaletteOutlined />
      </Box>

      {!showStates ? null : (
        <Box sx={{ position: "absolute", bottom: 0, left: 0 }}>
          <Button
            onClick={onOpenShades}
            sx={{
              color: previewForegroundReadable,
              backgroundColor: previewForegroundReadable
                ? alpha(previewForegroundReadable, 0.07)
                : undefined,
              display: "inline-flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <ViewCompact fontSize="small" sx={{ mb: "2px" }} />
            States
          </Button>
        </Box>
      )}
    </Card>
  );
}
