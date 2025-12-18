import { useState, useRef } from "react";

interface UseSwipeToCloseOptions {
  onClose: () => void;
  threshold?: number;
}

export function useSwipeToClose({ onClose, threshold = 100 }: UseSwipeToCloseOptions) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchCurrent, setTouchCurrent] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchCurrent(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    setTouchCurrent(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchCurrent === null) {
      setTouchStart(null);
      setTouchCurrent(null);
      return;
    }

    const diff = touchCurrent - touchStart;
    // If swiped down more than threshold, trigger close
    if (diff > threshold) {
      onClose();
    }

    setTouchStart(null);
    setTouchCurrent(null);
  };

  const swipeOffset =
    touchStart !== null && touchCurrent !== null
      ? Math.max(0, touchCurrent - touchStart)
      : 0;

  const isSwipingDown = touchStart !== null;

  return {
    ref,
    swipeOffset,
    isSwipingDown,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
