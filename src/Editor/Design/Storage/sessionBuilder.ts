import type { DesignEditStore } from "../Edit/useEdit";
import type { SavedSessionData } from "./types";

export function buildSessionData(state: DesignEditStore): SavedSessionData {
  return {
    activeColorScheme: state.activeColorScheme,
    colorSchemeIndependentVisualToolEdits:
      state.colorSchemeIndependentVisualToolEdits,
    light: {
      visualToolEdits: state.colorSchemes?.light?.visualToolEdits || {},
    },
    dark: {
      visualToolEdits: state.colorSchemes?.dark?.visualToolEdits || {},
    },
    codeOverridesSource: state.codeOverridesSource,
  };
}
