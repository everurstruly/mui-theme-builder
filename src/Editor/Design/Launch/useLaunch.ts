import { useState, useCallback } from "react";
import { useSave } from "../Persistence/hooks/useSave";
import { useEdit } from "../Edit/useEdit";
import { usePersistenceStore } from "../Persistence/persistenceStore";
import { serializeThemeOptions } from "../compiler";
import { getTemplateById } from "../../Templates/registry";

export type LaunchStatus = "idle" | "launching" | "success" | "blocked";

export interface LaunchBlocker {
  reason: "UNSAVED_CHANGES";
  context: { targetTemplateId: string };
  resolutions: {
    discardAndProceed: () => void;
    cancel: () => void;
  };
}

export function useLaunch() {
  const { isDirty } = useSave();
  const loadNew = useEdit((s) => s.loadNew);
  const setSnapshotId = usePersistenceStore((s) => s.setSnapshotId);
  const currentSnapshotId = usePersistenceStore((s) => s.currentSnapshotId);

  const [status, setStatus] = useState<LaunchStatus>("idle");
  const [blocker, setBlocker] = useState<LaunchBlocker | null>(null);

  // Internal executor: Actually loads the design
  const executeLaunch = useCallback(
    (templateId: string) => {
      setStatus("launching");
      setBlocker(null);

      try {
        // 1. Clear persistence context (new design = no snapshot)
        setSnapshotId(null);

        // 2. Load the design
        if (templateId === "__blank__") {
          loadNew();
        } else {
          const template = getTemplateById(templateId);
          if (template) {
            const themeCode = serializeThemeOptions(template.themeOptions);
            loadNew(themeCode, { templateId, title: template.label });
          }
        }

        setStatus("success");
        // Reset to idle on next tick
        setTimeout(() => setStatus("idle"), 0);
      } catch (err) {
        console.error("Launch failed", err);
        setStatus("idle");
        // Here you could set a different blocker for 'LOAD_FAILED' if needed
      }
    },
    [loadNew, setSnapshotId]
  );

  // Public API
  const launch = useCallback(
    (templateId: string) => {
      // Only block if there's a saved design with unsaved changes
      // Don't block for brand new unsaved designs (currentSnapshotId === null)
      const hasUnsavedChanges = isDirty && currentSnapshotId !== null;
      
      if (hasUnsavedChanges) {
        // HIT A BLOCKER: Return the context and resolutions
        setStatus("blocked");
        setBlocker({
          reason: "UNSAVED_CHANGES",
          context: { targetTemplateId: templateId },
          resolutions: {
            discardAndProceed: () => executeLaunch(templateId),
            cancel: () => {
              setStatus("idle");
              setBlocker(null);
            },
          },
        });
      } else {
        // HAPPY PATH
        executeLaunch(templateId);
      }
    },
    [isDirty, currentSnapshotId, executeLaunch]
  );

  return {
    launch,
    status,
    blocker, // UI checks: if (blocker) showDialog(blocker.reason)
  };
}
