import { Typography, Stack, Box, Button } from "@mui/material";
import { useCallback, useState } from "react";
import useDesignCreatedTheme from "../../../Design/Current/useCreatedTheme";
import useEditProperty from "../../../Design/Current/Modify/useEditProperty";
import useCurrent from "../../../Design/Current/useCurrent";
import { UnfoldMoreOutlined } from "@mui/icons-material";
import FontFamilyPopover from "./FontFamilyPopover";

export type FontFamilyOptionProps = {
  title: string;
  path: string;
  disabled?: boolean;
};

const headingPaths = [
  "typography.h1.fontFamily",
  "typography.h2.fontFamily",
  "typography.h3.fontFamily",
  "typography.h4.fontFamily",
  "typography.h5.fontFamily",
  "typography.h6.fontFamily",
];

export default function FontFamilyOption({
  path,
  title,
  disabled,
}: FontFamilyOptionProps) {
  const {
    typography: { fontFamily },
  } = useDesignCreatedTheme();

  const {
    value,
    // userEdit,
    // isCodeControlled,
    setValue: setValueLocal,
    reset: resetLocal,
  } = useEditProperty(path);

  // For batch operations (apply/reset across all headings) use the store-level
  // edit functions to avoid creating multiple subscriptions via hooks.
  const addGlobalDesignerEdit = useCurrent((s) => s.addNeutralDesignerEdit);
  const removeGlobalDesignerEdit = useCurrent((s) => s.removeNeutralDesignerEdit);

  const autoResolvedValue = fontFamily;
  const resolvedValue = (value as string) ?? autoResolvedValue;
  // const canResetValue = !!userEdit || !!isCodeControlled;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverOpen = Boolean(anchorEl);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      setAnchorEl(event.currentTarget);
    },
    [disabled]
  );

  const handleClose = useCallback(() => setAnchorEl(null), []);

  const handleSelectFromPopover = useCallback(
    (fontFamilyValue: string) => {
      if (path === "typography.h1.fontFamily") {
        headingPaths.forEach((p) => addGlobalDesignerEdit(p, fontFamilyValue));
      } else {
        setValueLocal(fontFamilyValue);
      }

      // setAnchorEl(null);
    },
    [path, setValueLocal, addGlobalDesignerEdit]
  );

  const handleReset = useCallback(() => {
    if (path === "typography.h1.fontFamily") {
      headingPaths.forEach((p) => removeGlobalDesignerEdit(p));
    } else {
      resetLocal();
    }
  }, [path, removeGlobalDesignerEdit, resetLocal]);

  return (
    <Stack
      component={"li"}
      sx={{
        rowGap: 0.5,
        flex: "1 1 0",
        minWidth: 0,
        alignItems: "center",
      }}
    >
      <Button
        onClick={handleClick}
        sx={{
          width: "100%",
          p: { xs: 1, lg: 2 },
          rowGap: 1,
          display: "flex",
          flexDirection: "column",
          color: (theme) => theme.palette.text.primary,
          background: (theme) => theme.palette.background.default,
          cursor: disabled ? "not-allowed" : "pointer",
          borderRadius: 3,
          transition: "background-color 150ms ease-in-out",

          "&:hover": {
            backgroundColor: disabled ? "inherit" : "action.hover",
          },
        }}
      >
        <Box
          sx={{
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexGrow: 1,
            columnGap: 1,
          }}
        >
          <Typography
            variant="body2"
            title={title}
            color="text.secondary"
            sx={{
              overflow: "hidden",
              lineClamp: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              fontWeight: 400,
              fontSize: "caption.fontSize",
              lineHeight: 1,
              maxWidth: "80%",
              marginInlineEnd: "auto",
            }}
          >
            {title}
          </Typography>

          <UnfoldMoreOutlined sx={{ fontSize: "12px", lineHeight: 1 }} />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            /* Reserve exactly two lines of content: first line for the big preview, second for the font name. */
            height: 68,
            minHeight: 68,
            maxHeight: 68,
            overflow: "hidden",
          }}
        >
          <Typography
            sx={{
              fontSize: 42,
              lineHeight: 1,
              fontFamily: formatFontFamilyWithFallback(resolvedValue),
              /* prevent the large preview from affecting line-wrapping */
              display: "block",
              textAlign: "center",
            }}
          >
            Aa
          </Typography>

          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              lineHeight: 1,
              mt: 0.25,
              width: "100%",
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={extractPrimaryFont(resolvedValue) || "Default"}
          >
            {extractPrimaryFont(resolvedValue) || "Default"}
          </Typography>
        </Box>
      </Button>

      <FontFamilyPopover
        anchorEl={anchorEl}
        open={popoverOpen}
        title={title}
        onClose={handleClose}
        onSelect={handleSelectFromPopover}
        onReset={handleReset}
        currentValue={resolvedValue}
        disabled={disabled}
      />
    </Stack>
  );
}

function formatFontFamilyWithFallback(selectedFont: string) {
  return selectedFont.includes(" ")
    ? `"${selectedFont}", sans-serif`
    : `${selectedFont}, sans-serif`;
}

// Extract primary font from full fontFamily string (e.g., "Roboto", "Helvetica", "Arial", sans-serif -> Roboto)
function extractPrimaryFont(fontFamily: string): string {
  const match = fontFamily.match(/^['"]?([^'",]+)['"]?/);
  return match ? match[1].trim() : fontFamily;
}
