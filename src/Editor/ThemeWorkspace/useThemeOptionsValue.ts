import { getNestedValue } from "./utils/objectHelpers";
import { useThemeWorkspaceStore } from "./themeWorkspaceStore";
import { useThemeWorkspaceCreatedTheme } from "./useCreatedTheme.hooks";

export const useThemeWorkspaceEditValue = (path: string) => {
  const { theme } = useThemeWorkspaceCreatedTheme();
  const setThemeOption = useThemeWorkspaceStore(
    (state) => state.addThemeOptionsUserEdit
  );

  const shouldBeEditedWithCode = false;
  const value = getNestedValue(theme, path) as string;
  const isUserEditted = false;

  const setValue = (value: string) => {
    setThemeOption(path, value);
  };

  const resetToBase = () => {
    // omo
  };

  return {
    value,
    shouldBeEditedWithCode,
    isUserEditted,
    setValue,
    resetToBase,
  };
};
