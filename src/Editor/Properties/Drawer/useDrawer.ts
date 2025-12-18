import { create } from "zustand";

interface DrawerState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export function createDrawerStore() {
  return create<DrawerState>((set) => ({
    open: false,
    setOpen: (open) => set({ open }),
    toggle: () => set((state) => ({ open: !state.open })),
  }));
}

// Simple hook for non-zustand drawer state
export function useDrawer(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen);

  const toggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const close = React.useCallback(() => {
    setOpen(false);
  }, []);

  const openDrawer = React.useCallback(() => {
    setOpen(true);
  }, []);

  return {
    open,
    setOpen,
    toggle,
    close,
    open: openDrawer,
  };
}

import * as React from "react";
