import ColorPickerPopover from "./ColorPickerPopover";
import OptionListItemResetButton from "../OptionListItemResetButton";
import useColorEdit from "./useColorEdit";
import ColorPreviewCard from "./ColorPreviewCard";
import { Typography, Stack } from "@mui/material";
import { useShadesDrawerStore } from "./ShadesDrawer/useShadesDrawerStore";
import type { UseShadesDrawerState } from "./ShadesDrawer/useShadesDrawerStore";
import type { PaletteGroupItem } from "./Color";

type ColorOptionGroupItemProps = PaletteGroupItem;

export default function ColorOptionGroupItem(props: ColorOptionGroupItemProps) {
  const openShadesDrawer = useShadesDrawerStore(
    (s: UseShadesDrawerState) => s.openFor
  );
  const backgroundEdit = useColorEdit(props.fill);
  const foregroundEdit = useColorEdit(props.foreground || "");
  const background = backgroundEdit.pickedColor || backgroundEdit.color;
  const foreground = foregroundEdit.pickedColor || foregroundEdit.color;
  const contentColor = backgroundEdit.contentOnColorReadableShade;

  const canResetValue = backgroundEdit.canReset || foregroundEdit.canReset;

  function resetValue() {
    backgroundEdit.reset();
    foregroundEdit.reset();
  }

  return (
    <Stack>
      <ColorPreviewCard
        backgroundColor={background}
        foregroundColor={foreground}
        contentReadableColor={contentColor}
        onForegroundClick={foregroundEdit.openPicker}
        onBackgroundClick={backgroundEdit.openPicker}
        foregroundAnchorRef={foregroundEdit.anchorRef}
        backgroundAnchorRef={backgroundEdit.anchorRef}
        foregroundDisabled={foregroundEdit.hasDelegatedControl}
        backgroundDisabled={backgroundEdit.hasDelegatedControl}
        hasForeground={!!props.foreground}
        showStates={!!(props.shades && props.shades.length)}
        onOpenStates={() =>
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
