/**
 * Shared postMessage protocol between the parent and iframe preview.
 *
 * USED BY:
 * - ViewportFrameHost.tsx (parent) → sends/receives messages
 * - ViewportFrameContent.tsx (iframe) → receives/sends messages
 *
 * These constants ensure both sides speak the same language (no string typos).
 * Keep this file small and framework-agnostic so both sides can import from it.
 */

export const MESSAGE_IFRAME_READY = "IFRAME_READY" as const;
export const MESSAGE_MOUNT_COMPONENT = "MOUNT_COMPONENT" as const;

export type IframeReadyMessage = {
  type: typeof MESSAGE_IFRAME_READY;
};

export type MountComponentMessage = {
  type: typeof MESSAGE_MOUNT_COMPONENT;
  mountId?: number;
  // Theme is intentionally a serializable object (no functions)
  theme?: Record<string, unknown>;
  componentId?: string;
  componentLabel?: string;
  registryData?: Record<string, { id: string; label: string; description: string }>;
  registryComponentIds?: string[];
  props?: Record<string, unknown>;
};

export type PreviewMessage = IframeReadyMessage | MountComponentMessage;
