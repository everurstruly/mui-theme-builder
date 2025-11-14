import React from "react";
import useEditorUiStore from "../editorUiStore";
import { DoubleArrowOutlined } from "@mui/icons-material";
import { Stack, Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { useThemeDesignStore } from "../ThemeDesign";
import { buildSamplesTree, type TreeNode } from "../Previews/registry";

function QuickPreviewBar() {
  const hiddenPanels = useEditorUiStore((state) => state.hiddenPanels);
  const shouldBeHidden = !hiddenPanels.includes("explorer");

  const activePreviewId = useThemeDesignStore((s) => s.activePreviewId);
  const selectPreview = useThemeDesignStore((s) => s.selectPreview);
  // Build static tree once per session
  const samplesTree = React.useMemo(() => buildSamplesTree(), []);

  // activeFolderChain: folder-focused navigation state. Initialized from activePreviewId's folder.
  const initialChain = activePreviewId
    ? findFolderChain(samplesTree, activePreviewId) ?? []
    : [];
  const [activeFolderChain, setActiveFolderChain] =
    React.useState<string[]>(initialChain);

  React.useEffect(() => {
    const newChain = activePreviewId
      ? findFolderChain(samplesTree, activePreviewId) ?? []
      : [];
    setActiveFolderChain((prev) => {
      if (JSON.stringify(prev) === JSON.stringify(newChain)) return prev;
      return newChain;
    });
  }, [activePreviewId, samplesTree]);

  // Current folder node and its children entries (folders + components)
  const currentFolderNode =
    activeFolderChain && activeFolderChain.length > 0
      ? getFolderNodeByChain(samplesTree, activeFolderChain)
      : null;

  const childrenEntries: Array<[string, TreeNode]> = currentFolderNode
    ? Object.entries(currentFolderNode.children || {})
    : Object.entries(samplesTree);

  // Visual cue when navigating up one level: detect chain shortening
  const prevChainRef = React.useRef<string[] | null>(null);
  const [upCue, setUpCue] = React.useState(false);
  const upCueTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const prev = prevChainRef.current;
    const curr = activeFolderChain || [];
    if (prev && curr.length < prev.length) {
      // triggered navigation up
      setUpCue(true);
      if (upCueTimerRef.current) window.clearTimeout(upCueTimerRef.current);
      upCueTimerRef.current = window.setTimeout(() => setUpCue(false), 300);
    }
    prevChainRef.current = curr;

    return () => {
      if (upCueTimerRef.current) window.clearTimeout(upCueTimerRef.current);
    };
  }, [activeFolderChain]);

  if (shouldBeHidden) {
    return null;
  }

  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      sx={{
        alignItems: "center",
        backdropFilter: "blur(40px)",
        borderBottom: 1,
        borderBottomColor: "divider",
      }}
    >
      <Breadcrumbs
        aria-label="quick-previews-breadcrumbs"
        separator={<DoubleArrowOutlined sx={{ fontSize: ".8625rem" }} />}
        sx={{
          px: 1.5,
          fontSize: "body2.fontSize",
          alignItems: "center !important",
          backgroundColor: (theme) => theme.palette.background.paper,
        }}
      >
        <Link
          component="button"
          underline="none"
          color="inherit"
          sx={{ whiteSpace: "nowrap", py: 1 }}
          onClick={() => {
            // Clicking 'Previews' -> focus root folder
            setActiveFolderChain([]);
          }}
        >
          List of Previews
        </Link>

        {/* Render folder-only breadcrumbs from the activeFolderChain */}
        {activeFolderChain && activeFolderChain.length > 0
          ? activeFolderChain.map((key, idx) => {
              // Get node for this chain prefix to read label
              const node = getFolderNodeByChain(
                samplesTree,
                activeFolderChain.slice(0, idx + 1)
              );
              const label = node?.label || key;

              return (
                <Link
                  key={key}
                  component="button"
                  underline="none"
                  color="inherit"
                  sx={{ py: 1, whiteSpace: "nowrap" }}
                  onClick={() => {
                    // Move up one level when clicking a breadcrumb folder
                    // e.g. clicking the folder at index `idx` will shorten the chain to `0..idx-1` (one level up)
                    setActiveFolderChain(activeFolderChain.slice(0, idx));
                  }}
                >
                  {label}
                </Link>
              );
            })
          : null}

        <Box sx={{ display: "flex", ml: -1.7 }}>
          <DoubleArrowOutlined sx={{ fontSize: ".8625rem" }} />
        </Box>
      </Breadcrumbs>

      {/* <Divider orientation="vertical" flexItem /> */}

      <Stack
        direction={"row"}
        // pl={1.5}
        divider={
          <Typography
            color="action.disabled"
            sx={{ userSelect: "none", fontWeight: 400 }}
          >
            {"//"}
          </Typography>
        }
        sx={{
          columnGap: 1,
          alignItems: "center",
          borderLeftColor: "divider",
          backgroundColor: "transparent",
          overflowX: "auto",
          // animation/visual cue when navigating up: translate + fade briefly
          transition: "transform 220ms ease, opacity 220ms ease, box-shadow 220ms ease",
          transform: upCue ? "translateY(-6px)" : "translateY(0)",
          opacity: upCue ? 0.85 : 1,
          boxShadow: upCue ? (theme) => `0 6px 18px ${theme.palette.action.hover}` : "none",
        }}
      >
        {childrenEntries.map(([key, node]) => {
          if (node.type === "folder") {
            return (
              <Link
                key={key}
                variant="body2"
                component="button"
                underline="none"
                color="inherit"
                sx={{ whiteSpace: "nowrap", px: 1.5, py: 1 }}
                onClick={() =>
                  setActiveFolderChain([...(activeFolderChain || []), key])
                }
              >
                {node.label}
              </Link>
            );
          }

          return (
            <Link
              key={key}
              variant="body2"
              component="button"
              underline="none"
              sx={{ whiteSpace: "nowrap", px: 1.5, py: 1 }}
              color={node.id === activePreviewId ? "primary" : "inherit"}
              onClick={() => selectPreview(node.id as string)}
            >
              {node.label}
            </Link>
          );
        })}
      </Stack>
    </Stack>
  );
}

function findFolderChain(
  tree: Record<string, TreeNode>,
  targetId: string
): string[] | null {
  const helper = (
    nodeMap: Record<string, TreeNode>,
    path: string[]
  ): string[] | null => {
    for (const [key, node] of Object.entries(nodeMap)) {
      if (node.type === "component" && node.id === targetId) {
        return path; // found at this level
      }

      if (node.type === "folder") {
        const res = helper(node.children || {}, [...path, key]);
        if (res) return res;
      }
    }
    return null;
  };

  return helper(tree, []);
}

function getFolderNodeByChain(
  tree: Record<string, TreeNode>,
  chain: string[]
): TreeNode | null {
  let current: Record<string, TreeNode> = tree;
  let node: TreeNode | null = null;

  for (const key of chain) {
    node = current[key];
    if (!node || node.type !== "folder") return null;
    current = node.children || {};
  }

  return node;
}

export default QuickPreviewBar;
