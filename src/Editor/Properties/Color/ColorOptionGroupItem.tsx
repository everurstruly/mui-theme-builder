import { Typography, Stack } from "@mui/material";
import ColorPickerPopover from "./ColorPickerPopover";
import { useShadesDrawerStore } from "./ShadesDrawer/useShadesDrawerStore";
import type { UseShadesDrawerState } from "./ShadesDrawer/useShadesDrawerStore";
import OptionListItemResetButton from "../OptionListItemResetButton";
import useColorEdit from "./useColorEdit";
import type { PaletteGroupItem } from "./Color";
import ColorPreviewCard from "./ColorPreviewCard";

type ColorOptionGroupItemProps = PaletteGroupItem;

export default function ColorOptionGroupItem(props: ColorOptionGroupItemProps) {
  const openShadesDrawer = useShadesDrawerStore(
    (s: UseShadesDrawerState) => s.openFor
  );
  const backgroundEdit = useColorEdit(props.fill);
  const foregroundEdit = useColorEdit(props.foreground || "");
  const canResetValue = backgroundEdit.canReset || foregroundEdit.canReset;

  const background = backgroundEdit.previewColor || backgroundEdit.color;
  const foreground = foregroundEdit.previewColor || foregroundEdit.color;
  const appReadableForeground =
    backgroundEdit.previewReadableForegroundColor ||
    backgroundEdit.readableForegroundColor;

  function resetValue() {
    backgroundEdit.reset();
    foregroundEdit.reset();
  }

  return (
    <Stack>
      <ColorPreviewCard
        previewBackground={background}
        previewForeground={foreground}
        previewForegroundReadable={appReadableForeground}
        hasForeground={!!props.foreground}
        onForegroundClick={foregroundEdit.openPicker}
        onBackgroundClick={backgroundEdit.openPicker}
        foregroundAnchorRef={foregroundEdit.anchorRef}
        backgroundAnchorRef={backgroundEdit.anchorRef}
        foregroundDisabled={foregroundEdit.hasDelegatedControl}
        backgroundDisabled={backgroundEdit.hasDelegatedControl}
        showStates={!!(props.shades && props.shades.length)}
        onOpenShades={() =>
          openShadesDrawer(props.shades ?? [], undefined, props.name)
        }
      />

      {props.foreground && (
        <ColorPickerPopover
          open={foregroundEdit.open}
          anchorEl={foregroundEdit.anchorEl}
          onClose={foregroundEdit.closePicker}
          color={foregroundEdit.color}
          onChange={foregroundEdit.onColorChange}
        />
      )}

      <ColorPickerPopover
        open={backgroundEdit.open}
        anchorEl={backgroundEdit.anchorEl}
        onClose={backgroundEdit.closePicker}
        color={backgroundEdit.color}
        onChange={backgroundEdit.onColorChange}
      />

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
