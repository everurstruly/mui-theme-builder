import { Popover } from "@mui/material";
import { Sketch } from "@uiw/react-color";

type Props = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  color: string;
  onChange: (c: any) => void;
};

export default function ColorPickerPopover({ open, anchorEl, onClose, color, onChange }: Props) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
    >
      <Sketch color={color} onChange={onChange} disableAlpha={false} />
    </Popover>
  );
}
