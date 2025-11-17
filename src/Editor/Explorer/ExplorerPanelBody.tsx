import { Divider, Typography } from "@mui/material";
import SampleCanvasObjectsTree from "./Menus/SampleCanvasObjectsTree";

export default function ExplorerPanelBody() {
  return (
    <>
      <Divider />
      <Typography variant="button" component="h6" sx={{ py: 2, mx: 1.5 }}>
        List of Previews
      </Typography>
      <SampleCanvasObjectsTree />
    </>
  );
}

