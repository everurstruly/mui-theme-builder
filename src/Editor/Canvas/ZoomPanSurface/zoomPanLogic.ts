/**
 * Compute the visual position for a given alignment mode.
 * For "center": centers content in container
 * For "start": aligns content to left (x=0)
 */
export function computeAlignedPosition(
  containerWidth: number,
  contentWidth: number,
  scale: number,
  alignment: "center" | "start"
): { x: number; y: number } {
  switch (alignment) {
    case "center":
      return {
        x: (containerWidth - contentWidth * scale) / 2,
        y: 0,
      };
    case "start":
      return { x: 0, y: 0 };
  }
}

/**
 * Compute the translate position to apply to the DOM element.
 * If alignment is "pan", use the absolute position from the store.
 * Otherwise, compute aligned position.
 */
export function computeTranslatePosition(
  containerWidth: number,
  contentWidth: number,
  scale: number,
  position: { x: number; y: number },
  alignment: string
): { x: number; y: number } {
  if (alignment === "pan") {
    return position;
  }

  // For center/start modes, compute aligned position
  return computeAlignedPosition(
    containerWidth,
    contentWidth,
    scale,
    alignment as "center" | "start"
  );
}

export function computeDragPosition(
  dragStartPos: { x: number; y: number },
  currentMousePos: { x: number; y: number },
  initialPosition: { x: number; y: number }
) {
  const dx = currentMousePos.x - dragStartPos.x;
  const dy = currentMousePos.y - dragStartPos.y;
  return {
    x: initialPosition.x + dx,
    y: initialPosition.y + dy,
  };
}

export function clampZoom(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Get the next zoom preset in the cycle
 */
export function getNextZoomPreset(
  currentZoom: number,
  presets: readonly number[]
): number {
  const index = presets.findIndex((lvl) => lvl === currentZoom);
  const nextIndex = index === -1 ? 0 : (index + 1) % presets.length;
  return presets[nextIndex];
}

/**
 * Get the next alignment mode in the cycle
 */
export function getNextAlignment(
  currentAlignment: string,
  order: readonly string[]
): string {
  const index = order.indexOf(currentAlignment);
  const nextIndex = (index + 1) % order.length;
  return order[nextIndex];
}
