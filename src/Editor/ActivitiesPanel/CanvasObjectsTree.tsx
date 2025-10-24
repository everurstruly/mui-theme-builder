import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";

export default function CanvasObjectsTree() {
  return (
    <Box sx={{ minHeight: 352, paddingBlock: 1 }}>
      <SimpleTreeView>
        <TreeItem itemId="grid" label="Components" aria-expanded="true">
          <TreeItem itemId="grid-community" label="@mui/x-data-grid" />
          <TreeItem itemId="grid-pro" label="@mui/x-data-grid-pro" />
          <TreeItem itemId="grid-premium" label="@mui/x-data-grid-premium" />
        </TreeItem>
        <TreeItem itemId="pickers" label="Examples">
          <TreeItem itemId="pickers-community" label="@mui/x-date-pickers" />
          <TreeItem itemId="pickers-pro" label="@mui/x-date-pickers-pro" />
        </TreeItem>
        <TreeItem itemId="charts" label="Custom">
          <TreeItem itemId="charts-community" label="@mui/x-charts" />
          <TreeItem itemId="charts-pro" label="@mui/x-charts-pro" />
        </TreeItem>
      </SimpleTreeView>
    </Box>
  );
}
