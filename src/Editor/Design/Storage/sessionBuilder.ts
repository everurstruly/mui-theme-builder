import type { DesignEditStore } from "../Edit/useEdit";
import type { SavedSessionData } from "./types";

export function buildSessionData(state: DesignEditStore): SavedSessionData {
  const shouldMigrate = !!(state as any)["colorSchemes"];

  if (shouldMigrate) {
    const _state = state as any;
    return {
      activeColorScheme: state.activeColorScheme,
      neutralEdits: state.neutralEdits,
      light: {
        designer: _state.colorSchemes?.light?.designer || {},
      },
      dark: {
        designer: _state.colorSchemes?.dark?.designer || {},
      },
      codeOverridesSource: state.codeOverridesSource,
    };
  }

  return {
    activeColorScheme: state.activeColorScheme,
    neutralEdits: state.neutralEdits,
    light: {
      designer: state.schemeEdits?.light?.designer || {},
    },
    dark: {
      designer: state.schemeEdits?.dark?.designer || {},
    },
    codeOverridesSource: state.codeOverridesSource,
  };
}
