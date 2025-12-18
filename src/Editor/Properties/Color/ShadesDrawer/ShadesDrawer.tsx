import { Box, List, ListItem, Typography, Button } from "@mui/material";
import { useShadesDrawerStore } from "./useShadesDrawerStore";
import ShadeListItem from "./ShadeMenuItem";
import { Drawer } from "../../Drawer";

export default function ShadesDrawer() {
  const open = useShadesDrawerStore((s) => s.open);
  const shades = useShadesDrawerStore((s) => s.shades);
  const title = useShadesDrawerStore((s) => s.title);
  const selectedPath = useShadesDrawerStore((s) => s.selectedPath);
  const close = useShadesDrawerStore((s) => s.close);

  return (
    <Drawer
      open={open}
      onClose={close}
      title={title ? `${title} Color Map` : "Shades"}
      data-shades-count={shades.length}
      data-selected-path={selectedPath ?? ""}
    >
      <Box sx={{ overflow: "auto", flex: 1, pt: 3, pb: 8 }}>
        <List disablePadding>
          {shades && shades.length > 0 ? (
            shades.map((s) => (
              <ShadeListItem key={s.path} title={s.name} path={s.path} />
            ))
          ) : (
            <ListItem>
              <Typography variant="caption">No states</Typography>
            </ListItem>
          )}
        </List>
      </Box>

      <Button color="error" onClick={close} sx={{ mb: 2, mx: 2 }}>
        Close
      </Button>
    </Drawer>
  );
}
