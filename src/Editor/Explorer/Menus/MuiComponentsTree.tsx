import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { muiComponentsRegistry } from "../../Previews/MuiComponents/muiComponentsRegistry";
import useCurrent from "../../Design/Current/useCurrent";

export default function MuiComponentsTree() {
  const activePreviewId = useCurrent((state) => state.activePreviewId);
  const selectPreview = useCurrent((state) => state.selectPreview);

  const handleSelectComponent = (_event: React.SyntheticEvent | null, itemId: string | null) => {
    if (itemId && !itemId.startsWith("folder-")) {
      // Add 'mui-' prefix to match the registry ID format
      const previewId = `mui-${itemId}`;
      selectPreview(previewId);
      // console.log("[MuiComponentsTree] Selected:", previewId);
    }
  };

  // Check if activePreviewId is a MUI component and extract the component name
  const selectedComponent = activePreviewId?.startsWith("mui-") 
    ? activePreviewId.replace("mui-", "") 
    : null;

  // Build a flat, alphabetically sorted list of MUI components
  const flatEntries = Object.entries(muiComponentsRegistry).sort((a, b) =>
    a[1].label.localeCompare(b[1].label)
  );

  return (
    <Box sx={{ minHeight: 352, padding: 1, maxHeight: "70vh", overflow: "auto" }}>
      <SimpleTreeView
        selectedItems={selectedComponent}
        onSelectedItemsChange={handleSelectComponent}
        sx={{
          ".MuiTreeItem-label": {
            fontSize: 14,
            py: 0.5,
          },
        }}
      >
        {flatEntries.map(([componentId, component]) => (
          <TreeItem key={componentId} itemId={componentId} label={component.label} />)
        )}
      </SimpleTreeView>
    </Box>
  );
}

