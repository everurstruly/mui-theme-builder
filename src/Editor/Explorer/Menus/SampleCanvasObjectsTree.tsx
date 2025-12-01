import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { buildSamplesTree, type TreeNode } from "../../Previews/registry";
import * as React from "react";
import useCurrent from "../../Design/Current/useCurrent";

export default function SampleCanvasObjectsTree() {
  // Build once; tree is static for session
  const samplesTree = React.useMemo(() => buildSamplesTree(), []);
  const activePreviewId = useCurrent((state) => state.activePreviewId);
  const selectPreview = useCurrent((state) => state.selectPreview);

  const handleSelectSample = (sampleId: string) => {
    selectPreview(sampleId);
  };

  const renderTree = (node: TreeNode, key: string): React.ReactNode => {
    if (node.type === "component") {
      return (
        <TreeItem key={node.id || key} itemId={node.id || key} label={node.label} />
      );
    }

    if (node.type === "folder") {
      return (
        <TreeItem key={key} itemId={`folder-${key}`} label={node.label}>
          {Object.entries(node.children || {}).map(([childKey, childNode]) =>
            renderTree(childNode, childKey)
          )}
        </TreeItem>
      );
    }

    return null;
  };

  return (
    <Box sx={{ minHeight: 352, padding: 1 }}>
      <SimpleTreeView
        selectedItems={activePreviewId}
        onSelectedItemsChange={(_, itemId) => {
          if (
            itemId &&
            typeof itemId === "string" &&
            !itemId.startsWith("folder-")
          ) {
            handleSelectSample(itemId);
          }
        }}
        sx={{
          ".MuiTreeItem-label": {
            fontSize: 15,
          },

          "& .MuiTreeItem-root[aria-selected='true']": {
            borderLeft: (t) => `3px solid ${t.palette.primary.main}`,
          },
        }}
      >
        {Object.entries(samplesTree).map(([key, node]) => renderTree(node, key))}
      </SimpleTreeView>
    </Box>
  );
}

