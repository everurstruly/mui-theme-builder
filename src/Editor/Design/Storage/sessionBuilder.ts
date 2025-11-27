import type { SavedSessionData } from "./types";

// Build a session object from the editor state. Keeps knowledge of the
// editor store shape centralized here.
export function buildSessionData(state: any): SavedSessionData {
  return {
    activeColorScheme: state.activeColorScheme,
    colorSchemeIndependentVisualToolEdits: state.colorSchemeIndependentVisualToolEdits,
    light: {
      visualToolEdits: state.colorSchemes?.light?.visualToolEdits || {},
    },
    dark: {
      visualToolEdits: state.colorSchemes?.dark?.visualToolEdits || {},
    },
    codeOverridesSource: state.codeOverridesSource,
  };
}
