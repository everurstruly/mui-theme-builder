import * as React from 'react';
import { buildSamplesTree, findFolderChain, getFolderNodeByChain, type TreeNode } from '../Previews/registry';

export default function useFolderNavigator(activePreviewId?: string | null) {
  // Build static tree once per session
  const samplesTree = React.useMemo(() => buildSamplesTree(), []);

  const arraysEqual = React.useCallback((a: string[] | null, b: string[] | null) => {
    if (a === b) return true;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
    return true;
  }, []);

  const initialChain = React.useMemo(() => {
    return activePreviewId ? findFolderChain(samplesTree, activePreviewId) ?? [] : [];
  }, [samplesTree, activePreviewId]);

  const [activeFolderChain, setActiveFolderChain] = React.useState<string[]>(initialChain);

  React.useEffect(() => {
    setActiveFolderChain((prev) => (arraysEqual(prev, initialChain) ? prev : initialChain));
  }, [initialChain, arraysEqual]);

  const currentFolderNode = React.useMemo(() => {
    return activeFolderChain && activeFolderChain.length > 0
      ? getFolderNodeByChain(samplesTree, activeFolderChain)
      : null;
  }, [samplesTree, activeFolderChain]);

  const childrenEntries = React.useMemo((): Array<[string, TreeNode]> => {
    return (currentFolderNode ? Object.entries(currentFolderNode.children || {}) : Object.entries(samplesTree)) as Array<[string, TreeNode]>;
  }, [currentFolderNode, samplesTree]);

  // up-cue detection
  const prevChainRef = React.useRef<string[] | null>(null);
  const [upCue, setUpCue] = React.useState(false);
  const upCueTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const prev = prevChainRef.current;
    const curr = activeFolderChain || [];
    if (prev && curr.length < prev.length) {
      setUpCue(true);
      if (upCueTimerRef.current) window.clearTimeout(upCueTimerRef.current);
      upCueTimerRef.current = window.setTimeout(() => setUpCue(false), 300) as unknown as number;
    }
    prevChainRef.current = curr;

    return () => {
      if (upCueTimerRef.current) window.clearTimeout(upCueTimerRef.current);
    };
  }, [activeFolderChain]);

  return {
    samplesTree,
    activeFolderChain,
    setActiveFolderChain,
    currentFolderNode,
    childrenEntries,
    upCue,
  } as const;
}
