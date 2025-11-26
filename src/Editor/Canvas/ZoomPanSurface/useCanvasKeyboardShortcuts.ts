/**
 * Canvas Keyboard Shortcuts Hook
 * 
 * Provides keyboard shortcuts for canvas operations:
 * - Ctrl/Cmd + Plus/Minus: Zoom in/out
 * - Ctrl/Cmd + 0: Reset view
 * - H: Toggle hand tool (drag lock)
 * - Escape: Reset view
 * - Space (hold): Temporary pan mode
 */

import { useEffect, useRef } from "react";
import useCanvasView from "../useCanvasView";

type UseCanvasKeyboardShortcutsOptions = {
  enabled?: boolean;
  target?: HTMLElement | Window;
};

export default function useCanvasKeyboardShortcuts({
  enabled = true,
  target,
}: UseCanvasKeyboardShortcutsOptions = {}) {
  const zoomIn = useCanvasView((s) => s.zoomIn);
  const zoomOut = useCanvasView((s) => s.zoomOut);
  const resetCamera = useCanvasView((s) => s.resetCamera);
  const toggleDragLock = useCanvasView((s) => s.toggleDragLock);
  const dragLock = useCanvasView((s) => s.camera.dragLock);

  const spacePressed = useRef(false);
  const previousDragLock = useRef(dragLock);

  useEffect(() => {
    if (!enabled) return;

    const element = target || window;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in an input field
      const target = e.target as HTMLElement;
      const isTyping = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[role="textbox"]') || // Monaco editor
        target.closest('.monaco-editor'); // Monaco editor container
      
      if (isTyping) {
        return; // Don't handle shortcuts when typing
      }

      // Space key - temporary pan mode
      if (e.code === "Space" && !spacePressed.current) {
        e.preventDefault();
        spacePressed.current = true;
        previousDragLock.current = dragLock;
        if (!dragLock) {
          toggleDragLock(); // Enable drag lock temporarily
        }
        return;
      }

      // Ctrl/Cmd + Plus/Equal - Zoom in
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "=")
      ) {
        e.preventDefault();
        zoomIn();
        return;
      }

      // Ctrl/Cmd + Minus - Zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault();
        zoomOut();
        return;
      }

      // Ctrl/Cmd + 0 - Reset view
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        resetCamera();
        return;
      }

      // H - Toggle hand tool (drag lock)
      if (e.key === "h" || e.key === "H") {
        e.preventDefault();
        toggleDragLock();
        return;
      }

      // Escape - Reset view
      if (e.key === "Escape") {
        e.preventDefault();
        resetCamera();
        return;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Space key released - restore previous drag lock state
      if (e.code === "Space" && spacePressed.current) {
        e.preventDefault();
        spacePressed.current = false;
        if (!previousDragLock.current && dragLock) {
          toggleDragLock(); // Restore previous state
        }
        return;
      }
    };

    element.addEventListener("keydown", handleKeyDown as EventListener);
    element.addEventListener("keyup", handleKeyUp as EventListener);

    return () => {
      element.removeEventListener("keydown", handleKeyDown as EventListener);
      element.removeEventListener("keyup", handleKeyUp as EventListener);
    };
  }, [enabled, target, zoomIn, zoomOut, resetCamera, toggleDragLock, dragLock]);
}

