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
          borderColor: backgroundEdit.borderColor,
          backgroundColor: backgroundEdit.color,
        }}
      >
        <Box
          ref={foregroundEdit.anchorRef}
          onClick={foregroundEdit.openPicker}
          component={Button}
          color="primary"
          sx={{
            display: props.foreground ?? "none",
            cursor: foregroundEdit.hasDelegatedControl ? "not-allowed" : "pointer",
            opacity: foregroundEdit.hasDelegatedControl ? 0.5 : 1,
            color: foregroundEdit.color,
            backgroundColor: alpha(foregroundEdit.readableForegroundColor, 0.05),
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
            color: backgroundEdit.readableForegroundColor,
            backgroundColor: alpha(backgroundEdit.readableForegroundColor, 0.05),
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
            color: backgroundEdit.readableForegroundColor,
            backgroundColor: alpha(backgroundEdit.readableForegroundColor, 0.05),
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
          sx={{ display: props.foreground ?? "none" }}
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
            color={foregroundEdit.color}
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
            color={backgroundEdit.color}
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
