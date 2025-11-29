import { Typography, Box, Stack, Popover, Card, Button, alpha } from "@mui/material";
import { Sketch } from "@uiw/react-color";
import { useShadesDrawerStore } from "./ShadesDrawer/useShadesDrawerStore";
import type { UseShadesDrawerState } from "./ShadesDrawer/useShadesDrawerStore";
import OptionListItemResetButton from "../OptionListItemResetButton";
import useColorPickerEdit from "./useColorPickerEdit";
import type { PaletteGroupItem } from "./Color";
import {
  PaletteOutlined,
  PhotoSizeSelectActualOutlined,
  ViewCompact,
} from "@mui/icons-material";

type ColorOptionGroupItemProps = PaletteGroupItem;

export default function ColorOptionGroupItem(props: ColorOptionGroupItemProps) {
  const openShadesDrawer = useShadesDrawerStore(
    (s: UseShadesDrawerState) => s.openFor
  );
  const backgroundEdit = useColorPickerEdit(props.fill);
  const foregroundEdit = useColorPickerEdit(props.foreground || "");
  const canResetValue = backgroundEdit.canReset || foregroundEdit.canReset;

  // Defensive/coercion guards: ensure values passed into MUI `sx` and color
  // props are the primitive types expected (mostly `string`). Some edits
  // can temporarily hold unexpected shapes (arrays, `true`, objects) which
  // cause TypeScript errors and runtime style problems.
  const safeBackgroundColor =
    typeof backgroundEdit.color === "string" ? backgroundEdit.color : undefined;
  const safeForegroundColor =
    typeof foregroundEdit.color === "string" ? foregroundEdit.color : undefined;
  const safeForegroundReadable =
    typeof foregroundEdit.readableForegroundColor === "string"
      ? foregroundEdit.readableForegroundColor
      : undefined;
  const safeBackgroundReadable =
    typeof backgroundEdit.readableForegroundColor === "string"
      ? backgroundEdit.readableForegroundColor
      : undefined;
  const safeBorderColor =
    typeof backgroundEdit.borderColor === "string" ? backgroundEdit.borderColor : undefined;

  function resetValue() {
    backgroundEdit.reset();
    foregroundEdit.reset();
  }

  return (
    <Stack>
      <Card
        elevation={0}
        sx={{
          position: "relative",
          width: "100%",
          height: 114,
          borderRadius: 4,
          border: 4,
          borderColor: safeBorderColor,
          backgroundColor: safeBackgroundColor,
        }}
      >
        <Box
          ref={foregroundEdit.anchorRef}
          onClick={foregroundEdit.openPicker}
          component={Button}
          sx={{
            display: props.foreground ? undefined : "none",
            cursor: foregroundEdit.hasDelegatedControl ? "not-allowed" : "pointer",
            opacity: foregroundEdit.hasDelegatedControl ? 0.5 : 1,
            color: safeForegroundColor,
            backgroundColor: safeForegroundReadable
              ? alpha(safeForegroundReadable, 0.05)
              : undefined,
            position: "absolute",
            top: 0,
            left: 0,
            columnGap: 0.5,
            rowGap: 0.2,
          }}
        >
          <PhotoSizeSelectActualOutlined fontSize="small" />
          <Typography variant="caption" fontWeight={"bold"} sx={{ mt: "4px" }}>
            & Text
          </Typography>
        </Box>

        <Box
          ref={backgroundEdit.anchorRef}
          onClick={backgroundEdit.openPicker}
          component={Button}
          color="primary"
          sx={{
            cursor: backgroundEdit.hasDelegatedControl ? "not-allowed" : "pointer",
            opacity: backgroundEdit.hasDelegatedControl ? 0.5 : 1,
            color: safeBackgroundReadable,
            backgroundColor: safeBackgroundReadable
              ? alpha(safeBackgroundReadable, 0.05)
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

        <Button
          onClick={() => openShadesDrawer(props.shades ?? [], undefined, props.name)}
          sx={{
            color: safeBackgroundReadable,
            backgroundColor: safeBackgroundReadable
              ? alpha(safeBackgroundReadable, 0.05)
              : undefined,
            display: !props.shades || !props?.shades?.length ? "none" : undefined,
            position: "absolute",
            bottom: 0,
            left: 0,
          }}
        >
          <ViewCompact fontSize="small" sx={{ mb: "2px" }} />
          States
        </Button>

        <Popover
          open={foregroundEdit.open}
          anchorEl={foregroundEdit.anchorEl}
          onClose={foregroundEdit.closePicker}
          sx={{ display: props.foreground ? undefined : "none" }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Sketch
            color={foregroundEdit.color as any}
            onChange={foregroundEdit.onColorChange}
            disableAlpha={false}
          />
        </Popover>

        <Popover
          open={backgroundEdit.open}
          anchorEl={backgroundEdit.anchorEl}
          onClose={backgroundEdit.closePicker}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <Sketch
            color={backgroundEdit.color as any}
            onChange={backgroundEdit.onColorChange}
            disableAlpha={false}
          />
        </Popover>
      </Card>

      <Stack
        direction="row-reverse"
        justifyContent="space-between"
        spacing={0.75}
        px={0.2}
        py={0.8}
      >
        <OptionListItemResetButton
          canResetValue={canResetValue}
          resetValue={resetValue}
          label={"Default"}
        />

        <Typography
          variant="caption"
          color="textSecondary"
          sx={{
            paddingInlineStart: 0.6,
            textTransform: "capitalize",
          }}
        >
          {props.name}
        </Typography>
      </Stack>
    </Stack>
  );
}
