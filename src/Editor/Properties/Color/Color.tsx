import ColorOptionGroup from "./ColorOptionGroup";
import ShadesDrawer from "./ShadesDrawer/ShadesDrawer";
import { Box, Stack } from "@mui/material";
import paletteGroupMap from "./paletteMap";

export type PaletteGroupItemAttribute = {
  name: string;
  path: string;
};

export type PaletteGroupItem = {
  name: string;
  fill: PaletteGroupItemAttribute["path"];
  foreground?: PaletteGroupItemAttribute["path"];
  shades?: PaletteGroupItemAttribute[];
};

export type PaletteGroup = {
  title: string;
  defaultOpen?: boolean;
  items: PaletteGroupItem[];
};

export default function ColorProperty() {
  return (
    <>
      <Stack>
        {paletteGroupMap.map((group) => (
          <Box key={group.title}>
            <ColorOptionGroup
              title={group.title}
              defaultOpen={group.defaultOpen}
              items={group.items}
            />
          </Box>
        ))}
      </Stack>
      <ShadesDrawer />
    </>
  );
}
