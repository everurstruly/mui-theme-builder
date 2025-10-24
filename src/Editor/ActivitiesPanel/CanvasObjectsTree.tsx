import Box from "@mui/material/Box";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem } from "@mui/x-tree-view/TreeItem";
import { buildSamplesTree, type TreeNode } from "../Samples/registry";
import useViewportSimulationStore from "../Canvas/ViewportSimulation/viewportSimulationStore";

export default function CanvasObjectsTree() {
  const samplesTree = buildSamplesTree();
  const selectedComponent = useViewportSimulationStore(
    (state) => state.selectedComponent
  );
  const setSelectedComponent = useViewportSimulationStore(
    (state) => state.setSelectedComponent
  );

  const handleSelectSample = (sampleId: string) => {
    setSelectedComponent(sampleId);
  };

  const renderTree = (node: TreeNode, key: string): React.ReactNode => {
    if (node.type === "component") {
      return (
        <TreeItem
          key={node.id || key}
          itemId={node.id || key}
          label={node.label}
        />
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
    <Box sx={{ minHeight: 352, paddingBlock: 1 }}>
      <SimpleTreeView
        selectedItems={selectedComponent}
        onSelectedItemsChange={(_, itemId) => {
          if (
            itemId &&
            typeof itemId === "string" &&
            !itemId.startsWith("folder-")
          ) {
            handleSelectSample(itemId);
          }
        }}
      >
        {Object.entries(samplesTree).map(([key, node]) =>
          renderTree(node, key)
        )}
      </SimpleTreeView>
    </Box>
  );
}
